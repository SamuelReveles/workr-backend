import { executeQuery, executeTransaction } from "../database/connection";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { generateReferenceRecordsInsertionQuery } from "../database/queryGenerators";
import { getDateString } from "../helpers/datetime";
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
}

export default Vacancy;