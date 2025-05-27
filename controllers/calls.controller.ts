import Call from "../models/Call";

/**
 * Genera un token de autenticación para un empleado en una llamada.
 * @returns HTTP 200 con un json que contiene el token si se encuentra
 * la información de empleado del usuario autenticado,
 * HTTP 404 si no se encuentra la información del empleado,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const generateEmployeeCallAccessToken = async (req, res) => {
  try {
    const token = await Call.generateEmployeeCallToken(req.userId);
    if (token != null) {
      return res.status(200).json({ token });
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Obtiene el directorio de llamadas de la empresa a la que pertenece un empleado.
 * @returns HTTP 200 con un json que contiene el directorio si se
 * encuentra correctamente el registro de empleado del usuario autenticado,
 * HTTP 404 si no se encuentra el registro de empleado del usuario,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const getEmployeeCompanyCallDirectory = async (req, res) => {
  try {
    const directory = await Call.getEmployeeCompanyCallDirectory(req.userId);
    if (directory != null) {
      return res.status(200).json({ directory });
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Obtiene los usuarios conectados en una llamada de la empresa
 * a la que pertenece un empleado.
 * @returns HTTP 200 con un json que contiene la lista de usuarios en la
 * llamada de la empresa a la que pertenece el empleado autenticado
 * si es que se encuentra el registro de empleado,
 * HTTP 404 si no se encuentra el registro de empleado,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const getUsersInCompanyCall = async (req, res) => {
  try {
    const users = await Call.getUsersInCompanyCall(req.userId);
    if (users != null) {
      return res.status(200).json({ users });
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch (err) {
    return res.sendStatus(500);
  }
}