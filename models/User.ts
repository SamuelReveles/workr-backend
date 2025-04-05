import { ResultSetHeader, RowDataPacket } from "mysql2";
import { executeQuery } from "../database/connection";
import { isPasswordEqualToStored, hashPassword } from "../helpers/encryption";

class User {
  constructor(
    public name: String,
    public id: String,
    public age: Number,
    public color: String,
  ) {}
  
  /**
   * Crea un usuario en la BD con los datos indicados
   * @param email Correo del usuario.
   * @param password Contraseña del usuario (a hashear para almacenar de forma segura).
   * @returns Una promesa que resuelve a True si se creó correctamente el usuario, o False de otro modo.
   */
  public static async create(email: string, password: string): Promise<boolean> {
    const hashedPassword = hashPassword(password);
    
    const query = "INSERT INTO Users(email, hashed_password) VALUES(?, ?)";
    const parameters = [email, hashedPassword];
    
    try {
      await executeQuery(query, parameters);
      return true;
    }
    catch (e) {
      return false;
    }
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