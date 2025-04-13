import JWT from "jsonwebtoken";

/**
* Middleware para verificar el JWT de una solicitud,
* si es válido incluye el parámetro userId a la request con
* el id obtenido del JWT.
*/
export function verifyJWT(req, res, next) {
  // Se obtiene la llave privada para JWT's configurada en el entorno.
  const secretKey = process.env.JWT_SECRET_KEY;

  const token = req.header("Authorization").substring("Bearer ".length);
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  // Se intenta decodificar el token con la clave privada y se retorna
  // su payload en caso de ser validado.
  try {
      const { userId } = JWT.verify(token, secretKey) as { userId: string };
      req.userId = userId;
      next();
  }
  // Si el token es inválido se atrapa su error y se devuelve null.
  catch (error) {
      res.status(401).json({ error: "Invalid token" });
      return null;
  }
}