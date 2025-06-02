import { UploadedFile } from "express-fileupload";
import { executeQuery, executeTransaction } from "../database/connection";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { RowDataPacket } from "mysql2";
import { getDateString } from "../helpers/datetime";
import { deleteProfilePictureFile, resolveProfilePicturePath, saveNewProfilePicture } from "../helpers/profilePictures";
import { generateReferenceRecordsDeletionQuery, generateReferenceRecordsInsertionQuery } from "../database/queryGenerators";
import { createImage, replaceImage } from "../helpers/cloudinary";

class UserProfile {
  /**
   * Actualiza los datos mostrados en el perfil de un usuario referenciado por su id,
   * guardando una nueva foto de perfil provista y tomando los nuevos datos para
   * los campos provistos en body.
   * @param userId Id del usuario cuyo perfil se actualizará.
   * @param profilePictureFile Nueva foto de perfil para el usuario.
   * @param body Conjunto de datos de perfil del usuario.
   */
  public static async updateProfile(userId: string, profilePictureFile: string, body) {    
    try {
      // Se recupera el id de imagen de perfil previa del usuario para su referencia.
      const oldProfilePictureURL = (await executeQuery(
        "SELECT profile_picture FROM Users WHERE id = ?",
        [userId]
      ))[0]["profile_picture"];
  
      let profilePictureURL = await (oldProfilePictureURL ? replaceImage(oldProfilePictureURL, profilePictureFile) : createImage(profilePictureFile));
      const updateTransactionQueries = this.generateUpdateTransactionQueries(userId, profilePictureURL, body);
      await executeTransaction(updateTransactionQueries);
    }
    catch (e) {
      console.log(e)
      throw e;
    }
  }

  /**
   * Obtiene la información de perfil del usuario referenciado.
   * @param userId Id del usuario cuyo perfil se obtendrá.
   * @returns Conjunto de información de perfil si existe, null de otro modo.
   */
  public static async getProfile(userId: string) {
    // Información que presenta al usuario brevemente.
    const presentationData = await this.queryProfilePresentationData(userId);

    // Si no se obtiene la información de presentación básica del usuario
    // significa que el perfil completo no existe.
    if (presentationData == null) {
      return null;
    }

    // Se obtiene información de las siguientes secciones del perfil.
    const contactLinks = await this.queryProfileRecords(userId, "User_contact_links");
    const experience = this.formatRecordsDates(
      await this.queryProfileRecords(userId, "Experience_records")
    );
    const skills = (await this.queryProfileRecords(userId, "User_skills")).map(
      row => row["skill_name"]
    );
    const education = this.formatRecordsDates(
      await this.queryProfileRecords(userId, "Education_records")
    );

    // Se devuelve un objeto que contiene toda la información del perfil.
    return { presentationData, contactLinks, experience, skills, education };
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

  private static profilePicturesDirectory = `${__dirname}/../file_uploads/user_pfp`;

  /**
   * Crea todas las queries necesarias para actualizar la BD con la nueva información
   * de perfil de un usuario.
   * @param userId Id del usuario cuyo perfil se actualizará.
   * @param newProfilePictureId Id de la nueva foto de perfil del usuario.
   * @param body Conjunto de datos actualizados del perfil del usuario.
   * @returns 
   */
  private static generateUpdateTransactionQueries(userId: string, newProfilePictureId: string, body) {
    const parameterizedQueries: ParameterizedQuery[] = []

    // Query para datos directos de usuario.
    parameterizedQueries.push(new ParameterizedQuery(
      "UPDATE Users SET profile_picture = ?, description = ?, last_update_date = ? WHERE id = ?",
      [newProfilePictureId, body.description, getDateString(), userId]
    ));

    // Queries para enlaces de contacto.
    parameterizedQueries.push(generateReferenceRecordsDeletionQuery("User_contact_links", "user_id", userId));
    parameterizedQueries.push(generateReferenceRecordsInsertionQuery(
      body.contactLinks,
      "User_contact_links",
      userId,
      (r) => [r.platform, r.link]
    ));

    // Queries para registros de experiencia.
    parameterizedQueries.push(generateReferenceRecordsDeletionQuery("Experience_records", "user_id", userId));
    parameterizedQueries.push(generateReferenceRecordsInsertionQuery(
      body.experience,
      "Experience_records",
      userId,
      (r) => [r.position, r.company, r.startDate, r.endDate, r.description]
    ));

    // Queries para habilidades.
    parameterizedQueries.push(generateReferenceRecordsDeletionQuery("User_skills", "user_id", userId));
    parameterizedQueries.push(generateReferenceRecordsInsertionQuery(
      body.skills,
      "User_skills",
      userId,
      (r) => [r]
    ));

    // Queries para registros de educación.
    parameterizedQueries.push(generateReferenceRecordsDeletionQuery("Education_records", "user_id", userId));
    parameterizedQueries.push(generateReferenceRecordsInsertionQuery(
      body.education,
      "Education_records",
      userId,
      (r) => [r.title, r.organization, r.startDate, r.endDate, r.description]
    ));

    return parameterizedQueries;
  }

  /**
   * Función auxiliar que obtiene la información que presenta al usuario brevemente.
   * @param userId Id del usuario cuya información se busca.
   * @returns Objeto con pares clave-valor de la información buscada si se encuentra el
   * perfil, null de otro modo.
   */
  private static async queryProfilePresentationData(userId) {
    const queryResults: RowDataPacket[] = await executeQuery(
      "SELECT profile_picture, full_name, description, country FROM Users WHERE id = ?",
      [userId]
    );

    if (queryResults.length == 0) {
      return null;
    }
    const dataRow = queryResults[0];

    return {
      profilePicture: dataRow["profile_picture"],
      fullName: dataRow["full_name"],
      description: dataRow["description"],
      country: dataRow["country"]
    };
  }

  /**
   * Función auxiliar que obtiene los registros de información que describen
   * una sección del perfil.
   * @param userId Id del usuario cuya información se busca.
   * @param profileSection Sección del perfil a la que pertenecen los datos.
   * @returns 
   */
  private static async queryProfileRecords(userId: string, profileSection: string) {
    let query = `SELECT * FROM ${profileSection} WHERE user_id = ?`;
    const params = [userId];

    const queryResults: RowDataPacket[] = await executeQuery(query, params);

    // Se devuelven los registros después de quitarles información de identificadores.
    return queryResults.map(resultRow => {
      delete resultRow["id"];
      delete resultRow["user_id"];
      return resultRow;
    })
  }

  /**
   * Función auxiliar para formatear la información de fechas al formato ISO-8601.
   * @param records Registros donde se formatearán las fechas.
   * @returns Registros con las fechas ya formateadas.
   */
  private static formatRecordsDates(records: any[]) {
    const dateSubstringLength = "AAAA-MM-DD".length;

    return records.map(row => {
      row["startDate"] = (row["start_date"] as Date).toISOString().substring(0, dateSubstringLength);
      row["endDate"] = (row["end_date"] as Date).toISOString().substring(0, dateSubstringLength);
      delete row["start_date"];
      delete row["end_date"];
      return row;
    });
  }
}

export default UserProfile;