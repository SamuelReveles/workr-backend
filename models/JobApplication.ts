import { executeQuery } from "../database/connection";
import { getDateString } from "../helpers/datetime";
import { generateUUID } from "../helpers/uuid";

class JobApplication {
  /**
   * Registra al usuario autenticado como un aspirante a
   * una vacante usando la información de la solicitud.
   * @param userId Id del usuario autenticado que se registra como aspirante.
   * @param body Cuerpo con los datos de solicitud de empleo a la vacante.
   */
  public static async register(userId, body) {
    // Se conforma el registro de la nueva solicitud de empleo.
    const newJobApplication = {
      id: generateUUID(),
      phone_number: body.phoneNumber,
      highest_education_level: body.highestEducationLevel,
      experience: body.experience,
      hard_skills: body.hardSkills,
      soft_skills: body.softSkills,
      application_reason: body.applicationReason,
      portfolio_link: body.portfolioLink,
      creation_date: getDateString(),
      vacancy_id: body.vacancyId,
      user_id: userId,
    };

    // Se registra la solicitud de empleo en la BD.
    await executeQuery(
      "INSERT INTO Job_applications SET ?",
      [ newJobApplication ]
    );
  }

  /**
   * Obtiene la lista de aspirantes a la vacante indicada si existe.
   * @param vacancyId Id de la vacante cuyos aspirantes se obtendrán.
   * @returns Array que contiene información resumida de los aspirantes
   * a la vacante indicada, o null si no se encuentra la vacante.
   */
  public static async getVacancyApplicants(vacancyId: string) {
    // Verificación para saber si la vacante realmente existe.
    const vacancyResults = await executeQuery(
      "SELECT position FROM Vacancies WHERE id = ?",
      [ vacancyId ]
    );

    // Si no se encuentran resultados para la vacante significa que no
    // existe, por tanto se devuelve null.
    if (vacancyResults.length == 0) {
      return null;
    }

    // Obtención de datos de aspirantes.
    const aspirantsResults = await executeQuery(
      "SELECT Job_applications.id AS job_application_id, Users.id AS user_id, " +
      "Users.full_name AS name, Users.profile_picture AS profile_picture " +
      "FROM Job_applications INNER JOIN Users ON Job_applications.user_id = Users.id " +
      "WHERE Job_applications.vacancy_id = ?",
      [ vacancyId ]
    );

    // Se devuelve un array conteniendo la información resumida de aspirantes.
    return aspirantsResults.map(row => {
      return {
        jobApplicationId: row["job_application_id"],
        aspirantId: row["user_id"],
        aspirantName: row["name"],
        aspirantProfilePicture: row["profile_picture"],
      };
    });
  }
}

export default JobApplication;