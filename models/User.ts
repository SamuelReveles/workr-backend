import { executeQuery } from "../database/connection";
import { hashPassword } from "../helpers/encryption";
import { generateUUID } from "../helpers/uuid";
import { getDateString } from "../helpers/datetime";

class User {
  /**
   * Crea un usuario en la BD con los datos indicados
   * @param fullName Nombre completo del usuario.
   * @param email Correo del usuario.
   * @param password Contraseña del usuario
   * (a hashear para almacenar de forma segura).
   * @param country País del usuario.
   * @returns Una promise que se resuelve si el
   * usuario se registra correctamente.
   */
  public static async create(
    fullName: string,
    email: string,
    password: string,
    country: string
  ): Promise<string> {
    const id = generateUUID();
    const hashedPassword = hashPassword(password);
    const emptyProfilePicture = "";
    const emptyDescription = "";
    const currentDate = getDateString();
    
    const query = "INSERT INTO Users"
      + "(id, full_name, email, hashed_password, profile_picture,"
      + " description, country, creation_date, last_update_date)"
      + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const parameters = [
      id,
      fullName,
      email,
      hashedPassword,
      emptyProfilePicture,
      emptyDescription,
      country,
      currentDate,
      currentDate
    ];
    
    await executeQuery(query, parameters);
    return id;
  }
}

export default User;