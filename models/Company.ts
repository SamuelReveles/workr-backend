import { UploadedFile } from "express-fileupload";
import { saveNewProfilePicture } from "../helpers/profilePictures";
import { executeQuery } from "../database/connection";
import { generateUUID } from "../helpers/uuid";
import { hashPassword } from "../helpers/encryption";
import { getDateString } from "../helpers/datetime";

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

  private static profilePicturesDirectory = `${__dirname}/../file_uploads/company_pfp`;
}

export default Company;