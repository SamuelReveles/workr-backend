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
}

export default JobApplication;