import { UploadedFile } from "express-fileupload";
import { RowDataPacket } from "mysql2";
import { executeQuery, executeTransaction } from "../database/connection";
import { generateUUID } from "../helpers/uuid";
import ParameterizedQuery from "../database/ParameterizedQuery";
import { rmSync } from "fs";

class UserProfile {
  public static async updateProfile(userId: string, profilePicture: UploadedFile, body) {
    const { description, contactLinks, experience, skills, education } = body;

    // Obtener id de imagen de perfil previa del usuario.
    const oldPfpQuery = "SELECT profile_picture FROM Users WHERE id = ?";
    const oldPfpParams = [ userId ];
    const result: RowDataPacket[] = await executeQuery(oldPfpQuery, oldPfpParams);
    const oldPfpFileName = result[0]["profile_picture"];

    // Subir la nueva imagen de perfil al almacenamiento.
    const fileExtension = profilePicture.name.split(".").pop();
    const imageUUID = generateUUID();
    const uploadedFileName = `${imageUUID}.${fileExtension}`;
    await profilePicture.mv(`${this.profilePicturesDirectory}/${uploadedFileName}`);

    const parameterizedQueries: ParameterizedQuery[] = []

    parameterizedQueries.push(new ParameterizedQuery(
      "UPDATE Users SET profile_picture = ?, description = ? WHERE id = ?",
      [ uploadedFileName, description, userId ]
    ));

    parameterizedQueries.push(new ParameterizedQuery(
      "DELETE FROM User_contact_links WHERE user_id = ?",
      [ userId ]
    ));

    const userContactLinks = JSON.parse(contactLinks);
    let userContactLinksQuery = "INSERT INTO User_contact_links VALUES";
    const userContactLinksParams = [];
    for (const l of userContactLinks) {
      userContactLinksQuery += " (?, ?, ?, ?),";
      userContactLinksParams.push(
        generateUUID(),
        l.platform,
        l.link,
        userId
      );
    }
    userContactLinksQuery = userContactLinksQuery.substring(0, userContactLinksQuery.length - 1);
    parameterizedQueries.push(new ParameterizedQuery(userContactLinksQuery, userContactLinksParams));

    parameterizedQueries.push(new ParameterizedQuery(
      "DELETE FROM Experience_records WHERE user_id = ?",
      [ userId ]
    ));

    const experienceRecords = JSON.parse(experience);
    let experienceInsertQuery = "INSERT INTO Experience_records VALUES";
    const experienceInsertParams = [];
    for(const r of experienceRecords) {
      experienceInsertQuery += " (?, ?, ?, ?, ?, ?, ?),";
      experienceInsertParams.push(
        generateUUID(),
        r.position,
        r.company,
        r.startDate,
        r.endDate,
        r.description,
        userId
      );
    }
    experienceInsertQuery = experienceInsertQuery.substring(0, experienceInsertQuery.length - 1);
    parameterizedQueries.push(new ParameterizedQuery(experienceInsertQuery, experienceInsertParams));

    parameterizedQueries.push(new ParameterizedQuery(
      "DELETE FROM User_skills WHERE user_id = ?",
      [ userId ]
    ));

    const userSkills = JSON.parse(skills);
    let userSkillsInsertQuery = "INSERT INTO User_skills VALUES";
    const userSkillsInsertParams = [];
    for (const s of userSkills) {
      userSkillsInsertQuery += " (?, ?, ?),";
      userSkillsInsertParams.push(
        generateUUID(),
        s,
        userId
      );
    }
    userSkillsInsertQuery = userSkillsInsertQuery.substring(0, userSkillsInsertQuery.length - 1);
    parameterizedQueries.push(new ParameterizedQuery(userSkillsInsertQuery, userSkillsInsertParams));

    parameterizedQueries.push(new ParameterizedQuery(
      "DELETE FROM Education_records WHERE user_id = ?",
      [ userId ]
    ));

    const educationRecords = JSON.parse(education);
    let educationInsertQuery = "INSERT INTO Education_records VALUES";
    const educationInsertParams = [];
    for (const r of educationRecords) {
      educationInsertQuery += " (?, ?, ?, ?, ?, ?, ?),";
      educationInsertParams.push(
        generateUUID(),
        r.title,
        r.organization,
        r.startDate,
        r.endDate,
        r.description,
        userId
      );
    }
    educationInsertQuery = educationInsertQuery.substring(0, educationInsertQuery.length - 1);
    parameterizedQueries.push(new ParameterizedQuery(educationInsertQuery, educationInsertParams));

    // Transacción principal de cambios.
    try {
      
      await executeTransaction(parameterizedQueries);
      
      // Si la transacción se completa correctamente, se borrará la imagen de perfil previa.
      if (oldPfpFileName !== "") {
        rmSync(`${this.profilePicturesDirectory}/${oldPfpFileName}`, { force: true });
      }
    }
    // Si ocurren errores en la transacción, se borrará la nueva imagen subida.
    catch (e) {
      rmSync(`${this.profilePicturesDirectory}/${uploadedFileName}`, { force: true });
      throw e;
    }
  }
  
  private static profilePicturesDirectory = `${__dirname}/../public/uploaded/user_pfp`;
}

export default UserProfile;