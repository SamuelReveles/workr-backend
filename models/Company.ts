import { UploadedFile } from "express-fileupload";
import { deleteProfilePictureFile, resolveProfilePicturePath, saveNewProfilePicture } from "../helpers/profilePictures";
import { executeQuery, executeTransaction } from "../database/connection";
import { generateUUID } from "../helpers/uuid";
import { hashPassword } from "../helpers/encryption";
import { getDateString } from "../helpers/datetime";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { generateReferenceRecordsDeletionQuery, generateReferenceRecordsInsertionQuery } from "../database/queryGenerators";
import { RowDataPacket } from "mysql2";

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

    // Se obtienen valores de declaración en tiempo de creación.
    const id = generateUUID();
    const hashedPassword = hashPassword(body.adminPassword);
    const emptyAddress = "";
    const emptyDescription = "";
    const emptyMission = "";
    const emptyVision = "";
    const currentDate = getDateString();

    // Se registra la empresa en la BD con todos los campos obtenidos.
    await executeQuery(
      "INSERT INTO companies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        body.name,
        body.adminEmail,
        hashedPassword,
        profilePictureId,
        body.type,
        body.commercialSector,
        body.employeeCount,
        emptyAddress,
        emptyDescription,
        emptyMission,
        emptyVision,
        currentDate,
        currentDate
      ]
    );
  }

  /**
   * Actualiza la información del perfil de una empresa tomando los datos
   * recibidos en la solicitud.
   * @param companyId Id de la empresa cuyo perfil se actualizará.
   * @param profilePictureFile Archivo con la nueva foto de perfil de la empresa.
   * @param body Conjunto de datos de perfil de la empresa.
   */
  public static async updateProfile(companyId: string, profilePictureFile: UploadedFile, body) {
    // Se obtiene el id de la antigua foto de perfil de la empresa para su referencia.
    const oldProfilePictureId = (await executeQuery(
      "SELECT profile_picture FROM Companies WHERE id = ?",
      [companyId]
    ))[0]["profile_picture"];

    // Se guarda la nueva foto de perfil en almacenamiento y se recupera su id de referencia.
    const newProfilePictureId = await saveNewProfilePicture(
      profilePictureFile, this.profilePicturesDirectory
    );

    // Se generan todas las queries para actualizar la información de perfil de la empresa.
    const updateTransactionQueries = this.generateUpdateTransactionQueries(
      companyId, newProfilePictureId, body
    );

    // Transacción principal de cambios.
    try {
      await executeTransaction(updateTransactionQueries);

      // Si la transacción se completa correctamente, se borrará la imagen de perfil previa.
      deleteProfilePictureFile(oldProfilePictureId, this.profilePicturesDirectory);
    }
    // Si ocurren errores en la transacción, se borrará la nueva imagen subida.
    catch (err) {
      deleteProfilePictureFile(newProfilePictureId, this.profilePicturesDirectory);
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
   * @param companyId Id de la empresa cuyo perfil se actualizará.
   * @param profilePictureId Id de la imagen de perfil de la empresa.
   * @param body Conjunto de datos de perfil de la empresa.
   * @returns Una lista de ParameterizedQueries adecuadas para la actualización deseada.
   */
  private static generateUpdateTransactionQueries(companyId: string, profilePictureId: string, body) {
    const transactionQueries: ParameterizedQuery[] = [];

    transactionQueries.push(new ParameterizedQuery(
      "UPDATE Companies SET profile_picture = ?, description = ?, mission = ?, vision = ?, address = ?, " +
      "last_update_date = ? WHERE id = ?",
      [
        profilePictureId,
        body.description,
        body.mission,
        body.vision,
        body.address,
        getDateString(),
        companyId
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