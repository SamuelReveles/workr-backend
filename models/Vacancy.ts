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
    transactionQueries.push(generateReferenceRecordsInsertionQuery(
      body.skills,
      "Vacancy_skills",
      vacancyId,
      skill => [ skill ]
    ));

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
}

export default Vacancy;