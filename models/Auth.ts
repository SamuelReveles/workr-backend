import { RowDataPacket } from "mysql2";
import { executeQuery } from "../database/connection";
import { isPasswordEqualToStored } from "../helpers/encryption";
import { generateJWT } from "../helpers/jwt";

class Auth {
  /**
   * Valida las credenciales de un intento de login para autenticar a un usuario o empresa.
   * @param email Correo ingresado identificando al usuario o empresa.
   * @param password Contraseña ingresada, usada para autenticación.
   * @returns Una promise que se resuelve con un JWT si se logra una autenticación,
   * o que se rechaza de otro modo.
   */
  public static async validateCredentials(email: string, password: string): Promise<any> {
    // Primero se intenta hacer un login como usuario.
    let queryResults: RowDataPacket[] = await executeQuery(
      "SELECT id, hashed_password FROM Users WHERE email = ?",
      [email]
    );
    let loginType = "";
    let virtualOfficeCompanyId = "";

    // Si el email coincide con un registro de usuario, se entiende un tipo de login de usuario.
    if (queryResults.length != 0) {
      loginType = "user";

      // Se determina si el usuario trabaja para una empresa,
      // si es así se recupera el id de la empresa para acceder a la oficina virtual,
      // si no, se devolverá una cadena vacía por defecto en el campo de referencia.
      let employeeCompanyResults = await executeQuery(
        "SELECT company_id FROM Employees WHERE user_id = ?",
        queryResults[0]["id"]
      );
      if (employeeCompanyResults.length > 0) {
        virtualOfficeCompanyId = employeeCompanyResults[0]["company_id"];
      }
    }
    else {
      // Si el email no coincide con un usuario, se intenta un login de empresa.
      queryResults = await executeQuery(
        "SELECT id, hashed_admin_password FROM Companies WHERE admin_email = ?",
        [email]
      );

      // Si el email coincide con un registro de empresa, se entiende un tipo de login de empresa.
      if (queryResults.length != 0) {
        loginType = "company";

        // Se incluye el id de la empresa en el campo de
        // referencia para la oficina virtual.
        virtualOfficeCompanyId = queryResults[0]["id"];
      }
      // Si el email no coincidió de nuevo, se rechaza la promesa de login.
      else {
        return Promise.reject(new Error("Unauthorized"));
      }
    }

    // Según el tipo de login se valida la contraseña con el campo adecuado.
    const storedPassword =
      queryResults[0][loginType == "user" ? "hashed_password" : "hashed_admin_password"];

    // Si la contraseña coincide con la almacenada, se resuelve la promesa de login
    // creando un jwt de autenticación.
    if (isPasswordEqualToStored(password, storedPassword)) {
      const jwt = generateJWT(queryResults[0]["id"], loginType);
      return Promise.resolve({ jwt, id: queryResults[0]["id"], loginType, virtualOfficeCompanyId });
    }
    // Si las contraseñas no coinciden, se rechaza la promesa de login.
    else {
      return Promise.reject(new Error("Unauthorized"));
    }
  }
}

export default Auth;