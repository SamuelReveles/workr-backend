import { RtcRole, RtcTokenBuilder } from "agora-token";
import { executeQuery } from "../database/connection";
import { makeHttpsRequest } from "../helpers/https";

class Call {
  /**
   * Genera un token de autenticación para un empleado en una llamada.
   * @param userId Id del usuario que será autenticado para la llamada.
   * @returns Token generado para el usuario especificado si se encuentra
   * su información de empleado correctamente, o null de otro modo.
   */
  public static async generateEmployeeCallToken(userId: string) {
    // Se busca la información de empleado del usuario referenciado.
    const employeeResults = await executeQuery(
      "SELECT company_id, call_user_id FROM Employees WHERE user_id = ?",
      [ userId ]
    );

    // Si no se obtienen resultados en la búsqueda significa que el usuario no es
    // un empleado registrado, por lo tanto se devuelve null.
    if (employeeResults.length == 0) {
      return null;
    }

    // Se extraen los datos de empleado de los resultados de búsqueda.
    const CALL_USER_ID = employeeResults[0]["call_user_id"];
    const COMPANY_ID = employeeResults[0]["company_id"];

    // Obtención de variables de entorno.
    const APP_ID = process.env.APP_ID;
    const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
    if (APP_ID == undefined || APP_ID == "") {
      throw new Error("Configuración errónea de APP_ID");
    }
    if (APP_CERTIFICATE == undefined || APP_CERTIFICATE == "") {
      throw new Error("Configuración errónea de APP_CERTIFICATE");
    }

    // Todo usuario que solicite token tendrá el mismo rol que permite
    // publicar streams de medios a la llamada.
    const ROLE = RtcRole.PUBLISHER;

    // El token generado y los permisos para interactuar en llamada
    // serán válidos durante diez minutos.
    const TOKEN_EXPIRATION_SECONDS = 600;
    const CALL_PRIVILEGES_EXPIRATION_SECONDS = TOKEN_EXPIRATION_SECONDS;

    // Se genera y devuelve el token con la configuración dada.
    return RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      COMPANY_ID,
      CALL_USER_ID,
      ROLE,
      TOKEN_EXPIRATION_SECONDS,
      CALL_PRIVILEGES_EXPIRATION_SECONDS
    );
  }

  /**
   * Obtiene el directorio de llamadas de la empresa a la que pertenezca
   * un empleado referenciado por su id de usuario.
   * @param userId Id del usuario del cual se buscará el directorio de
   * llamadas de la empresa a la que pertenezca como empleado.
   * @returns Mapa del directorio si se encuentra el registro de empleado
   * del usuario correctamente, o null de otro modo.
   */
  public static async getEmployeeCompanyCallDirectory(userId: string) {
    // Se busca el registro de empleado del usuario.
    const employeeResults = await executeQuery(
      "SELECT company_id FROM Employees WHERE user_id = ?",
      [ userId ]
    );

    // Si no se obtienen resultados en la búsqueda, significa que el usuario
    // no es un empleado registrado, por lo tanto se devuelve null.
    if (employeeResults.length == 0) {
      return null;
    }

    // Se busca la información a incluir en el directorio de los empleados
    // que tengan la misma empresa que el empleado autenticado.
    const directoryResults = await executeQuery(
      "SELECT full_name, position, call_user_id " +
      "FROM Users INNER JOIN Employees ON Users.id = Employees.user_id " +
      "WHERE Employees.company_id = ?",
      [ employeeResults[0]["company_id"] ]
    );

    // Se construye y devuelve el directorio de la empresa indexando por
    // el id de llamadas.
    return directoryResults.reduce((map, row) => {
      map[row["call_user_id"]] = {
        name: row["full_name"],
        position: row["position"]
      };
      return map;
    }, {});
  }

  /**
   * Obtiene los usuarios conectados a una llamada de la empresa
   * a la que pertenece el empleado autenticado.
   * @param userId Id del usuario del cual se buscarán los
   * usuarios conectados a una llamada de la empresa a la que
   * pertenezca como empleado.
   * @returns Un array con los usuarios conectados a la llamada si se
   * encuentra el registro de empleado del usuario y si se encuentra la llamada,
   * un array vacío si no se encuentra la llamada,
   * o null si no se encuentra el registro de empleado del usuario.
   */
  public static async getUsersInCompanyCall(userId: string) {
    // Se busca el registro de empleado del usuario.
    const employeeResults = await executeQuery(
      "SELECT company_id FROM Employees WHERE user_id = ?",
      [ userId ]
    );

    // Si no se obtienen resultados en la búsqueda, entonces el usuario no
    // es un empleado registrado, por lo tanto se devuelve null.
    if (employeeResults.length == 0) {
      return null;
    }

    // Se extrae el id de la empresa de los resultados de búsqueda.
    const COMPANY_ID = employeeResults[0]["company_id"];

    // Obtención de variables de entorno.
    const APP_ID = process.env.APP_ID
    const CUSTOMER_KEY = process.env.CUSTOMER_KEY;
    const CUSTOMER_SECRET = process.env.CUSTOMER_SECRET;
    if (APP_ID == undefined || APP_ID == "") {
      throw new Error("Configuración errónea de APP_ID");
    }
    if (CUSTOMER_KEY == undefined || CUSTOMER_KEY == "") {
      throw new Error("Configuración errónea de CUSTOMER_KEY");
    }
    if (CUSTOMER_SECRET == undefined || CUSTOMER_SECRET == "") {
      throw new Error("Configuración errónea de CUSTOMER_SECRET");
    }

    // Se crea el header de autorización para la API del servicio de llamadas con las credenciales.
    const PLAIN_CREDENTIAL = CUSTOMER_KEY + ":" + CUSTOMER_SECRET;
    const ENCODED_CREDENTIAL = Buffer.from(PLAIN_CREDENTIAL).toString("base64");
    const AUTHORIZATION_FIELD = "Basic " + ENCODED_CREDENTIAL;

    // Se configuran las opciones para la solicitud web segura a la API.
    const OPTIONS = {
      hostname: "api.agora.io",
      port: 443,
      path: `/dev/v1/channel/user/${APP_ID}/${COMPANY_ID}`,
      method: "GET",
      headers: {
        "Authorization": AUTHORIZATION_FIELD,
        "Content-Type": "application/json"
      }
    };

    // Se hace una solicitud HTTPS a la API, si se completa correctamente
    // se analizarán sus resultados.
    const apiResults = await makeHttpsRequest(OPTIONS);

    // Se extraen y validan los datos de la llamada desde los resultados de la API.
    const callData = apiResults["data"];
    if (callData == undefined) {
      throw new Error("No se pudo obtener información de la llamada");
    }
    const callExists = callData["channel_exist"];
    if (callExists == undefined) {
      throw new Error("No se pudo confirmar la existencia de la llamada");
    }
    const users = callData["users"];
    if (callExists && users == undefined) {
      throw new Error("No se pudo obtener la lista de usuarios de la llamada");
    }

    // Dependiendo de la existencia de la llamada se devuelve:
    // la lista de usuarios de la llamada existente,
    // o un array vacío para indicar que la llamada no existe.
    return (callExists ? users : []);
  }
}

export default Call;