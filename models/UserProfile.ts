import { UploadedFile } from "express-fileupload";
import { executeQuery, executeTransaction } from "../database/connection";
import { generateUUID } from "../helpers/uuid";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { existsSync, rmSync } from "fs";
import { RowDataPacket } from "mysql2";
import { resolve } from "path";
import { getDateString } from "../helpers/datetime";
import { saveNewProfilePicture } from "../helpers/profilePictures";

class UserProfile {
  /**
   * Actualiza los datos mostrados en el perfil de un usuario referenciado por su id,
   * guardando una nueva foto de perfil provista y tomando los nuevos datos para
   * los campos provistos en body.
   * @param userId Id del usuario cuyo perfil se actualizará.
   * @param profilePictureFile Nueva foto de perfil para el usuario.
   * @param body Conjunto de datos de perfil del usuario.
   */
  public static async updateProfile(userId: string, profilePictureFile: UploadedFile, body) {
    // Se recupera el id de imagen de perfil previa del usuario para su referencia.
    const oldProfilePictureId = (await executeQuery(
      "SELECT profile_picture FROM Users WHERE id = ?",
      [userId]
    ))[0]["profile_picture"];

    // Se guarda la nueva foto de perfil en almacenamiento y se recupera su id de referencia.
    const newProfilePictureId = await saveNewProfilePicture(profilePictureFile, this.profilePicturesDirectory);

    // Se generan todas las queries que actualizan los datos del perfil de usuario
    // con el id, la referencia de foto de perfil y los argumentos provistos en body.
    const updateTransactionQueries = this.generateUpdateTransactionQueries(userId, newProfilePictureId, body);

    // Transacción principal de cambios.
    try {
      await executeTransaction(updateTransactionQueries);
      
      // Si la transacción se completa correctamente, se borrará la
      // imagen de perfil previa (si existía).
      if (oldProfilePictureId !== "") {
        this.deleteProfilePictureFile(oldProfilePictureId);
      }
    }
    // Si ocurren errores en la transacción, se borrará la nueva imagen subida.
    catch (e) {
      this.deleteProfilePictureFile(newProfilePictureId);
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
    const path = `${this.profilePicturesDirectory}/${id}`;
    return existsSync(path) ? resolve(path) : null;
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
      [ newProfilePictureId, body.description, getDateString(), userId ]
    ));
    
    // Queries para enlaces de contacto.
    parameterizedQueries.push(this.generateDeletionQuery("User_contact_links", userId));
    parameterizedQueries.push(this.generateRecordsInsertionQuery(
      body.contactLinks,
      "User_contact_links",
      userId,
      (r) => [r.platform, r.link]
    ));

    // Queries para registros de experiencia.
    parameterizedQueries.push(this.generateDeletionQuery("Experience_records", userId));
    parameterizedQueries.push(this.generateRecordsInsertionQuery(
      body.experience,
      "Experience_records",
      userId,
      (r) => [r.position, r.company, r.startDate, r.endDate, r.description]
    ));

    // Queries para habilidades.
    parameterizedQueries.push(this.generateDeletionQuery("User_skills", userId));
    parameterizedQueries.push(this.generateRecordsInsertionQuery(
      body.skills,
      "User_skills",
      userId,
      (r) => [r]
    ));

    // Queries para registros de educación.
    parameterizedQueries.push(this.generateDeletionQuery("Education_records", userId));
    parameterizedQueries.push(this.generateRecordsInsertionQuery(
      body.education,
      "Education_records",
      userId,
      (r) => [r.title, r.organization, r.startDate, r.endDate, r.description]
    ));

    return parameterizedQueries;
  }

  /**
   * Método auxiliar para crear una query parametrizada enfocada a
   * borrar los registros de una tabla que referencien a cierto usuario.
   * @param table Tabla donde ser hará el borrado.
   * @param userId Id del usuario referenciado.
   * @returns Una ParameterizedQuery para el borrado deseado.
   */
  private static generateDeletionQuery(table, userId) {
    return new ParameterizedQuery(
      `DELETE FROM ${table} WHERE user_id = ?`,
      [ userId ]
    );
  }

  /**
   * Método auxiliar para generar una ParameterizedQuery adecuada para la inserción de
   * los datos contenidos en el JSON de entrada, para la tabla de BD indicada,
   * con el usuario referenciado y tomando las propiedades que se configuren por cada registro.
   * @param recordsJSONText Texto JSON que contiene todos los registros a insertar.
   * @param table Tabla de la BD a la cual se hará la inserción.
   * @param userId Id del usuario referenciado en los registros.
   * @param getRecordProperties Callback que produzca una lista con las propiedades a incluir
   * por cada registro en el orden de columnas de la BD.
   * @returns Una ParameterizedQuery para la inserción de datos deseada.
   */
  private static generateRecordsInsertionQuery(recordsJSONText: string, table: string, userId: string, getRecordProperties: (listItem) => any[]) {
    const records = JSON.parse(recordsJSONText);
    let insertQuery = `INSERT INTO ${table} VALUES`;
    const insertParams = [];

    // Cada entrada de lista en el JSON se convertirá en un registro a insertar.
    for (const r of records) {
      // El primer parámetro de cada registro es un ID único.
      insertQuery += " (?, ";
      insertParams.push(generateUUID());

      // Por cada propiedad listada con el callback se agrega
      // un placeholder a la query de inserción y un parámetro a la lista.
      const properties = getRecordProperties(r);
      for (const p of properties) {
        insertQuery += "?, ";
        insertParams.push(p);
      }

      // El último parámetro de cada registro es la referencia al usuario involucrado.
      insertQuery += "?),";
      insertParams.push(userId);
    }

    insertQuery = insertQuery.substring(0, insertQuery.length - 1);
    return new ParameterizedQuery(insertQuery, insertParams);
  }

  /**
   * Borra el archivo especificado de foto de perfil de un usuario.
   * @param profilePictureId identificador de la foto de perfil a borrar.
   */
  private static deleteProfilePictureFile(profilePictureId: string) {
    const fileLocation = `${this.profilePicturesDirectory}/${profilePictureId}`;
    rmSync(fileLocation, { force: true });
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