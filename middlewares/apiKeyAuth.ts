import { isAPIKeyValid } from "../helpers/encryption";

/**
 * Verifica que la api key sea correcta para las
 * solicitudes fuera de la fase de desarrollo.
 */
export function verifyAPIKey(req, res, next) {
  // Se evita el almacenamiento de la respuesta en cachés
  // para proteger el header de la api key.
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");

  if (process.env.ENV !== "dev") {
    try {
      const apiKey = req.header("Api-Key");
      if (!apiKey || !isAPIKeyValid(apiKey)) {
        return res.sendStatus(401);
      }
    }
    catch (err) {
      return res.sendStatus(401);
    }
  }

  // Tras una validación correcta se pasa al siguiente middleware.
  next();
}