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
      contact_email: body.contactEmail,
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

  /**
   * Obtiene las respuestas al formulario de solicitud de empleo
   * para la solicitud de empleo referenciada si es que existe.
   * @param jobApplicationId Id de la solicitud de empleo cuyo formulario
   * se recuperará.
   * @returns Objeto con respuestas al formulario de la solicitud de
   * empleo indicada, o null si no existe.
   */
  public static async getFormAnswers(jobApplicationId: string) {
    // Se busca la información de la solicitud.
    const applicationResults = await executeQuery(
      "SELECT * FROM Job_applications WHERE id = ?",
      [ jobApplicationId ]
    );

    // Si no se encuentran resultados para la solicitud referenciada
    // quiere decir que no existe, por tanto se devuelve null.
    if (applicationResults.length == 0) {
      return null;
    }

    // Se devuelven las respuestas al formulario de la solicitud de empleo.
    const applicationRow = applicationResults[0];
    return {
      contactEmail: applicationRow["contact_email"],
      phoneNumber: applicationRow["phone_number"],
      highestEducationLevel: applicationRow["highest_education_level"],
      experience: applicationRow["experience"],
      hardSkills: applicationRow["hard_skills"],
      softSkills: applicationRow["soft_skills"],
      applicationReason: applicationRow["application_reason"],
      portfolioLink: applicationRow["portfolio_link"],
    }
  }

  /**
   * Registra un agendado de entrevista en la base de datos para la 
   * solicitud referenciada
   * @param jobApplicationId Id de la solicitud de empleo por la cual se
   * agenda la entrevista.
   * @returns True si se registra la entrevista correctamente, o null
   * si no se encuentra la solicitud referenciada.
   */
  public static async registerInterview(jobApplicationId: string) {
    // Se busca información de la solicitud de empleo referenciada.
    const jobApplicationResults = await executeQuery(
      "SELECT creation_date FROM Job_applications WHERE id = ?",
      [ jobApplicationId ]
    );

    // Si no se encuentran resultados para la solicitud de empleo
    // significa que no existe, por tanto se devuelve null.
    if (jobApplicationResults.length == 0) {
      return null;
    }

    // Se define la información de un nuevo registro de notas de entrevista.
    const newJobInterviewNotes = {
      id: generateUUID(),
      interview_notes: "",
      job_application_id: jobApplicationId,
    };

    // Se registra una nueva entrada de notas de entrevista de empleo
    // asociadas a la solicitud referenciada, de esa manera se sabe
    // que la entrevista fue agendada.
    await executeQuery(
      "INSERT INTO Job_interview_notes SET ?",
      [ newJobInterviewNotes ]
    );
    
    return true;
  }

  /**
   * Devuelve un listado con información resumida de los aspirantes
   * contactados por una entrevista agendada para la vacante referenciada,
   * si existe.
   * @param vacancyId Id de la vacante cuyos aspirantes contactados se consultarán.
   * @returns Un array con el listado de aspirantes contactados para la vacante,
   * o null si la vacante no existe.
   */
  public static async getContactedVacancyApplicants(vacancyId: string) {
    // Se busca información sobre la vacante referenciada.
    const vacancyResults = await executeQuery(
      "SELECT creation_date FROM Vacancies WHERE id = ?",
      [ vacancyId ]
    );

    // Si no hay resultados para la vacante referenciada significa
    // que no existe, por tanto se devuelve null.
    if (vacancyResults.length == 0) {
      return null;
    }

    // Se obtiene información resumida de los usuarios que solicitaron empleo
    // para la vacante dada y que fueron contactados para una entrevista.
    const contactedApplicantsResults = await executeQuery(
      "SELECT U.id AS user_id, U.full_name AS user_name, U.profile_picture AS user_profile_picture, " +
      "A.id AS job_application_id, N.id AS interview_notes_id " +
      "FROM Users AS U INNER JOIN Job_applications AS A ON U.id = A.user_id " +
      "INNER JOIN Job_interview_notes AS N ON A.id = N.job_application_id " +
      "WHERE A.vacancy_id = ?",
      [ vacancyId ]
    );

    // Se devuelve el listado con información resumida de los aspirantes contactados.
    return contactedApplicantsResults.map(row => {
      return {
        applicantId: row["user_id"],
        applicantName: row["user_name"],
        applicantProfilePicture: row["user_profile_picture"],
        jobApplicationId: row["job_application_id"],
        interviewNotesId: row["interview_notes_id"],
      };
    });
  }
}

export default JobApplication;