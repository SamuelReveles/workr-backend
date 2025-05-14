import Auth from "../models/Auth";

/**
 * Verifica las credenciales de acceso indicadas en body
 * @returns HTTP 200 con un JWT de autenticación si las credenciales son correctas,
 * HTTP 400 si los parámetros son incorrectos,
 * HTTP 401 si las credenciales son incorrectas al autenticar,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const validateLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginResponse = await Auth.validateCredentials(email, password)
    res.status(200).json(loginResponse);
  }
  catch (e) {
    if (e.message === "Unauthorized") {
      res.status(401);
    }
    console.log(e);
    return res.sendStatus(500)
  }
}