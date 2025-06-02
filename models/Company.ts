import { UploadedFile } from "express-fileupload";
import { deleteProfilePictureFile, resolveProfilePicturePath, saveNewProfilePicture } from "../helpers/profilePictures";
import { executeQuery, executeTransaction } from "../database/connection";
import { generateUUID } from "../helpers/uuid";
import { hashPassword } from "../helpers/encryption";
import { getDateString } from "../helpers/datetime";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { generateReferenceRecordsDeletionQuery, generateReferenceRecordsInsertionQuery } from "../database/queryGenerators";
import { RowDataPacket } from "mysql2";
import { DataPoint, formatChartData } from '../helpers/charts';
import { createImage, replaceImage } from "../helpers/cloudinary";

class Company {
  /**
   * Registra una nueva empresa tomando los datos de la solicitud.
   * @param profilePictureFile Archivo con la foto de perfil de la empresa.
   * @param body Conjunto de datos de creación de la empresa.
   */
  public static async register(profilePictureFile: UploadedFile, body) {
    // Se guarda la nueva foto de perfil en almacenamiento y se recupera su id para referencia.
    const profilePictureId = await saveNewProfilePicture(
      profilePictureFile, this.profilePicturesDirectory
    );

    // Se define el nuevo registro a insertar en la BD.
    const newCompanyData = {
      id: generateUUID(),
      name: body.name,
      admin_email: body.adminEmail,
      hashed_admin_password: hashPassword(body.adminPassword),
      profile_picture: profilePictureId,
      type: body.type,
      commercial_sector: body.commercialSector,
      employee_count: body.employeeCount,
      creation_date: getDateString(),
      last_update_date: getDateString(),
    }

    // Se registra la empresa en la BD con su información definida.
    await executeQuery("INSERT INTO Companies SET ?", newCompanyData);
  }

  /**
   * Actualiza la información del perfil de una empresa tomando los datos
   * recibidos en la solicitud.
   * @param companyId Id de la empresa cuyo perfil se actualizará.
   * @param profilePictureFile Archivo con la nueva foto de perfil de la empresa.
   * @param body Conjunto de datos de perfil de la empresa.
   */
  public static async updateProfile(companyId: string, profilePictureFile: string, body) {
    try {
      // Se obtiene el id de la antigua foto de perfil de la empresa para su referencia.
      const oldProfilePictureURL = (await executeQuery(
        "SELECT profile_picture FROM Companies WHERE id = ?",
        [companyId]
      ))[0]["profile_picture"];

      let profilePictureURL = await (oldProfilePictureURL ? replaceImage(oldProfilePictureURL, profilePictureFile) : createImage(profilePictureFile));
      const updateTransactionQueries = this.generateUpdateTransactionQueries(companyId, profilePictureURL, body);
      await executeTransaction(updateTransactionQueries);
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  }

  /**
   * Obtiene la información de perfil de la empresa referenciada.
   * @param companyId Id de la empresa cuyo perfil se obtendrá.
   * @returns Conjunto de información de perfil si existe, null de otro modo.
   */
  public static async getProfile(companyId: string) {
    // Se busca la principal sección de información de la empresa.
    const mainData = await this.queryProfileMainData(companyId);

    // Si no se obtiene la información principal de la empresa
    // significa que el perfil completo no existe.
    if (mainData == null) {
      return null;
    }

    // Se obtienen los enlaces de contacto que referencian a la empresa.
    const contactLinks = await executeQuery(
      "SELECT platform, link FROM Company_contact_links WHERE company_id = ?",
      [companyId]
    );

    // Se devuelve un objeto que contiene toda la información del perfil.
    return { ...mainData, contactLinks };
  }

  /**
   * Obtiene la información de las gráficas de la empresa.
   * @param companyId Id de la empresa.
   * @returns Conjunto de información de las gráficas.
   */
  public static async getVacancyCharts(companyId: string) {
    const [applicationsData, newJobsData] = await Promise.all([
      // Obtener el historial de solicitudes de la empresa
      executeQuery(
        `
        SELECT COUNT(ja.id) AS quantity, MONTH(ja.creation_date) AS month, YEAR(ja.creation_date) AS year FROM Job_applications ja 
        INNER JOIN Vacancies v ON v.id = ja.vacancy_id 
        INNER JOIN Companies c ON c.id = v.company_id
        WHERE c.id = ?;
        `,
        [companyId]
      ),
      // Obtener alta de empleados
      executeQuery(
        `
          SELECT COUNT(user_id) AS quantity, MONTH(accepted_date) AS month, YEAR(accepted_date) AS year 
          FROM Employees
          WHERE company_id = ?;
        `,
        [companyId]
      )
    ]);

    const applicationsPoints = applicationsData.map(a => { return { quantity: a.quantity, month: a.month, year: a.year } });
    const newJobsDataPoints = newJobsData.map(j => { return { quantity: j.quantity, month: j.month, year: j.year } });

    return { apllications: formatChartData(applicationsPoints), jobs: formatChartData(newJobsDataPoints) };
  }

  /**
   * Obtiene la información de pago de la empresa.
   * @param companyId Id de la empresa.
   * @returns Conjunto de información de pago.
   */
  public static async getPayInfo(companyId: string) {
    const date = new Date();
    const paymentInfo = await executeQuery(`
      SELECT 
          COUNT(DISTINCT e.user_id) AS employees,
          c.value AS pricePerUser
      FROM Employees e
      CROSS JOIN (SELECT value FROM Constants WHERE name = 'PRICE_PER_USER') c
      WHERE e.company_id = ? AND (e.is_active = 1 OR e.accepted_date > ?);
    `, [companyId, date]);

    return { pricePerUser: paymentInfo[0].pricePerUser || 0, employeesCount: paymentInfo[0].employees || 0 };
  }

  /**
   * Guarda la información de pago de una empresa
   * @param payment Objeto de pago de la empresa
   */
  public static async savePayment(payment: any) {
    return await executeQuery(`INSERT INTO Stripe_Payments SET ?;`, [payment]);
  }

  /**
   * Resuelve la ruta absoluta a una foto de perfil referenciada si existe.
   * @param id Identificador de la foto cuya ruta se busca.
   * @returns Ruta absoluta para la foto de perfil si existe,
   * null de otro modo.
   */
  public static getProfilePicturePath(id: string) {
    return resolveProfilePicturePath(this.profilePicturesDirectory, id);
  }

  private static profilePicturesDirectory = `${__dirname}/../file_uploads/company_pfp`;

  /**
   * Función auxiliar para generar las queries de la transacción SQL de actualización
   * de perfil de la empresa.
   * @param companyId Id de la empresa cuyo perfil se actualizará
   * @param profilePictureId Id de la imagen de perfil de la empresa.
   * @param body Conjunto de datos de perfil de la empresa.
   * @returns Una lista de ParameterizedQueries adecuadas para la actualización deseada.
   */
  private static generateUpdateTransactionQueries(companyId: string, profilePictureId: string, body) {
    const transactionQueries: ParameterizedQuery[] = [];

    transactionQueries.push(new ParameterizedQuery(
      "UPDATE Companies SET ? WHERE id = ?",
      [
        {
          profile_picture: profilePictureId,
          description: body.description,
          mission: body.mission,
          vision: body.vision,
          address: body.address,
          last_update_date: getDateString(),
        },
        companyId,
      ]
    ));

    transactionQueries.push(generateReferenceRecordsDeletionQuery(
      "Company_contact_links", "company_id", companyId
    ));

    transactionQueries.push(generateReferenceRecordsInsertionQuery(
      body.contactLinks,
      "Company_contact_links",
      companyId,
      (r) => [r.platform, r.link]
    ));

    return transactionQueries;
  }

  /**
   * Función auxiliar que obtiene la información principal de la empresa
   * @param companyId Id de la empresa cuya información se busca.
   * @returns Objeto con pares clave-valor de la información buscada si se encuentra el
   * perfil, null de otro modo.
   */
  private static async queryProfileMainData(companyId) {
    const queryResults: RowDataPacket[] = await executeQuery(
      "SELECT name, profile_picture, type, commercial_sector, employee_count, address, " +
      "description, mission, vision FROM Companies WHERE id = ?",
      [companyId]
    );

    if (queryResults.length == 0) {
      return null;
    }
    const dataRow = queryResults[0];

    // Renombramiento de datos con identificador snake_case.
    dataRow.profilePicture = dataRow.profile_picture;
    delete dataRow.profile_picture;
    dataRow.commercialSector = dataRow.commercial_sector;
    delete dataRow.commercial_sector;
    dataRow.employeeCount = dataRow.employee_count;
    delete dataRow.employee_count;

    return dataRow;
  }
}

export default Company;