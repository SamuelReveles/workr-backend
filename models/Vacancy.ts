import { executeQuery, executeTransaction } from "../database/connection";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { generateReferenceRecordsInsertionQuery } from "../database/queryGenerators";
import { calculateDaysFrom, getDateString } from "../helpers/datetime";
import { generateUUID } from "../helpers/uuid";

class Vacancy {
  /**
   * Registra una nueva vacante en la BD con los datos indicados en solicitud.
   * @param body Cuerpo de la solicitud con los datos de la nueva vacante.
   * @param companyId Id de la empresa que publica la vacante.
   */
  public static async postVacancy(body, companyId: string) {
    // Configuración del nuevo registro de vacante.
    const vacancyId = generateUUID();
    const newVacancy = {
      id: vacancyId,
      position: body.position,
      office_address: body.officeAddress,
      work_modality: body.workModality,
      work_days: body.workDays,
      daily_schedule: body.dailySchedule,
      description: body.description,
      creation_date: getDateString(),
      accepts_applications: true,
      company_id: companyId,
    };

    const transactionQueries: ParameterizedQuery[] = [];

    // Se agrega la query que crea el registro base de la vacante a
    // las queries de la transacción a realizar para la publicación completa.
    transactionQueries.push(new ParameterizedQuery(
      "INSERT INTO Vacancies SET ?",
      [ newVacancy ]
    ));

    // Se agrega una query generada para insertar todas las skills asociadas
    // a la vacante.
    const vacancySkillsInsertionQuery = generateReferenceRecordsInsertionQuery(
      body.skills,
      "Vacancy_skills",
      vacancyId,
      skill => [ skill ]
    );
    if (vacancySkillsInsertionQuery != null) {
      transactionQueries.push(vacancySkillsInsertionQuery);
    }

    // Se ejecuta la transacción completa de cambios.
    await executeTransaction(transactionQueries);
  }

  /**
   * Devuelve un resumen de información de las vacantes de la empresa referenciada.
   * @param companyId Id de la empresa cuyas vacantes se consultarán.
   * @returns Un arreglo conteniendo información de resumen del listado de
   * vacantes de la empresa.
   */
  public static async getCompanyVacancies(companyId: string) {
    // Obtención de registros de vacantes de la empresa.
    const vacancyResults = await executeQuery(
      "SELECT id, position, office_address, creation_date FROM Vacancies WHERE company_id = ?",
      [ companyId ]
    );

    // Por cada registro de vacante se crea un objeto a incluir en 
    // un array que tenga los datos de interés para el listado de
    // vacantes de la empresa.
    const vacancyData: Object[] = [];
    for (const result of vacancyResults) {
      vacancyData.push({
        id: result["id"],
        position: result["position"],
        location: result["office_address"],
        daysAgo: calculateDaysFrom((result["creation_date"] as Date)),
      });
    }

    // Se devuelve el array.
    return vacancyData;
  }  

  /**
   * Busca las vacantes que coincidan con los filtros proporcionados, en el orden
   * deseado.
   * @param body Conjunto de parámetros para la búsqueda. 
   * @returns Array con los resultados de la búsqueda.
   */
  public static async searchVacancies(body) {
    // Se ajustan los parámetros de la query dependiendo de los datos provistos
    // en la request.
    const positionFilter = body.position != "" ? `%${body.position}%` : "%";
    const locationFilter = body.location != "" ? `%${body.location}%` : "%";
    const companyFilter = body.company != "" ? `%${body.company}%` : "%";
    const orderColumn = body.orderBy;
    const orderDirection = body.orderDirection;

    // Se realiza la consulta.
    const results = await executeQuery(
      "SELECT Vacancies.id AS id, position, office_address, Vacancies.creation_date AS creation_date, Companies.name AS company " +
      "FROM Vacancies INNER JOIN Companies ON Vacancies.company_id = Companies.id " +
      "WHERE Vacancies.accepts_applications = 1 AND " +
      "position LIKE ? AND " +
      "office_address LIKE ? AND " +
      "Companies.name LIKE ? " +
      `ORDER BY ${orderColumn} ${orderDirection}`,
      [ positionFilter, locationFilter, companyFilter ]
    );
    
    // Se devuelven los resultados como un arreglo de objetos.
    return results.map(row => {
      return {
        id: row["id"],
        position: row["position"],
        company: row["company"],
        location: row["office_address"],
        daysAgo: calculateDaysFrom((row["creation_date"] as Date)),
      }
    });
  }

  /**
   * Obtiene los detalles de la vacante indicada si existe.
   * @param vacancyId Id de la vacante cuyos detalles se obtendrán.
   * @returns Objeto con los detalles de la vacante referenciada si
   * se encuentra, o nulo de otro modo.
   */
  public static async getVacancyDetails(vacancyId) {
    // Se obtiene información básica de la vacante.
    const vacancyResults = await executeQuery(
      "SELECT * FROM Vacancies WHERE id = ?",
      [ vacancyId ]
    );

    // Si no se encontró coincidencia de la vacante se devuelve nulo.
    if (vacancyResults.length == 0) {
      return null;
    }

    // Si se encontró la vacante se obtiene su fila de resultados.
    const vacancyRow = vacancyResults[0];

    // Se obtiene información de la empresa y habilidades asociadas
    // con la vacante.
    const companyRow = (await executeQuery(
      "SELECT profile_picture, name FROM Companies WHERE id = ?",
      [ vacancyRow["company_id"] ]
    ))[0];
    const skillResults = await executeQuery(
      "SELECT skill_name FROM Vacancy_skills WHERE vacancy_id = ?",
      [ vacancyId ]
    );

    // Se devuelve un objeto con toda la información de la vacante.
    return {
      vacancyId: vacancyId,
      position: vacancyRow["position"],
      companyId: vacancyRow["company_id"],
      companyProfilePicture: companyRow["profile_picture"],
      companyName: companyRow["name"],
      postDate: (vacancyRow["creation_date"] as Date).toISOString().substring(0, 10),
      location: vacancyRow["office_address"],
      workModality: vacancyRow["work_modality"],
      description: vacancyRow["description"],
      skills: skillResults.map(row => row["skill_name"]),
      workDays: vacancyRow["work_days"],
      dailySchedule: vacancyRow["daily_schedule"],
    };
  }

  /**
   * Cierra una vacante para que ya no aparezca en resultados de búsqueda y no pueda
   * recibir nuevas solicitudes de aspirantes.
   * @param vacancyId Id de la vacante a cerrar.
   * @returns True si la vacante se cerró correctamente, o null si no se encontró.
   */
  public static async closeVacancy(vacancyId) {
    // Se busca la vacante en la BD para saber si existe.
    const vacancyResults = await executeQuery(
      "SELECT position FROM Vacancies WHERE id = ?",
      [ vacancyId ]
    );

    // Si no se encuentra la vacante en la BD significa que
    // no existe, por tanto se devuelve null.
    if (vacancyResults.length == 0) {
      return null;
    }

    // Se actualiza la vacante para que ya no esté disponible a solicitudes.
    await executeQuery(
      "UPDATE Vacancies SET accepts_applications = 0 WHERE id = ?",
      [ vacancyId ]
    );

    // Devolver true indica que la vacante se cerró correctamente.
    return true;
  }
}

export default Vacancy;