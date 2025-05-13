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
    return await Auth.validateCredentials(email, password)
      .then(jwt => res.status(200).json({ jwt }))
      .catch(_ => res.sendStatus(401));
  }
  catch (e) {
    console.log(e);
    return res.sendStatus(500)
  }
}