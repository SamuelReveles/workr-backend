import { executeQuery } from "../database/connection";
import { hashPassword } from "../helpers/encryption";
import { generateUUID } from "../helpers/uuid";
import { getDateString, getTimeString } from "../helpers/datetime";

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

  /**
   * Borra al usuario referenciado de los registros de empleado
   * que lo relacionan con una empresa.
   * @param userId Id del usuario que renuncia.
   * @returns True si la renuncia se procesa correctamente,
   * False si no se encontró el registro del empleado para borrarlo.
   */
  public static async quitJob(userId) {
    const employeeRecordResults = await executeQuery(
      "SELECT id FROM Employees WHERE user_id = ? AND is_active = TRUE",
      userId
    );

    // Si no se encuentra el registro de empleado se devuelve False.
    if (employeeRecordResults.length == 0) {
      return false;
    }
    // Si se encuentra el registro, se borra para la renuncia
    // y se devuelve True.
    else {
      await executeQuery(
        // "DELETE FROM Employees WHERE user_id = ?",
        "UPDATE Employees SET is_active = FALSE WHERE user_id = ?",
        userId
      );
      return true;
    }

  }

  /**
   * Cierra la sesión de trabajo referenciada.
   * @param workSessionId Id de la sesión a cerrar.
   * @returns True si el cierre se realiza correctamente, false si no
   * se encuentra la sesión.
   */
  public static async checkoutWorkSession(workSessionId) {
    // Se busca información de la sesión.
    const sessionResults = await executeQuery(
      "SELECT start_time FROM Work_sessions WHERE id = ?",
      [ workSessionId ]
    );

    // Si la búsqueda no arroja resultados significa que la sesión no existe,
    // por lo tanto se devuelve false.
    if (sessionResults.length === 0) {
      return false;
    }

    // Se obtienen los datos completos de tiempos.
    const todayString = getDateString();
    const startTimeString = sessionResults[0]["start_time"];
    const endTimeString = getTimeString();

    // Se calcula la diferencia de minutos entre el inicio y término de la sesión.
    const startTime = new Date(`${todayString}T${startTimeString}Z`);
    const endTime = new Date(`${todayString}T${endTimeString}Z`);
    const minutesDifference = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    // Se actualiza el registro de la sesión con los datos de cierre.
    const checkoutValues = {
      end_time: endTimeString,
      minutes: minutesDifference
    };
    await executeQuery(
      "UPDATE Work_sessions SET ? WHERE id = ?",
      [ checkoutValues, workSessionId ]
    );

    // Se retorna true para indicar update correcto.
    return true;
  }
}

export default User;