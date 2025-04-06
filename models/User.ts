import { ResultSetHeader, RowDataPacket } from "mysql2";
import { executeQuery } from "../database/connection";
import { isPasswordEqualToStored, hashPassword } from "../helpers/encryption";
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
  ): Promise<void> {
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
  }

  /**
   * Valida las credenciales de un intento de login y devuelve el HTTP response status
   * apropiado para representar el resultado.
   * @param email Correo ingresado identificando al usuario.
   * @param password Contraseña ingresada, usada para autenticación.
   * @returns 200 si se validan correctamente las credenciales,
   * 403 si se revisan las credenciales y los datos no coinciden,
   * 500 si no se logran validar las credenciales.
   */
  public static async validateCredentials(email: string, password: string) {
    const query = "SELECT hashed_password FROM Users WHERE email = ?";
    const parameters = [email];
    
    try {
      const results: RowDataPacket[] = await executeQuery(query, parameters);

      // Se indica un login incorrecto si el correo no se encuentra.
      if (results.length == 0) {
        return 403;
      }

      // Dependiendo de la comparativa de contraseña, se determina el estatus del login.
      const storedPassword = results[0]["hashed_password"];
      return isPasswordEqualToStored(password, storedPassword) ? 200 : 403;
    }
    catch(e) {
      return 500;
    }
  }
}

export default User;