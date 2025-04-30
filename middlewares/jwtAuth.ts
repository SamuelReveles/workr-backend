import JWT from "jsonwebtoken";

/**
* Middleware para verificar el JWT de una solicitud, si es válido
* incluye el parámetro apropiado de id según el tipo de token a la request.
*/
export function verifyJWT(req, res, next) {
  // Se obtiene la llave privada para JWT's configurada en el entorno.
  const secretKey = process.env.JWT_SECRET_KEY;

  const tokenHeader = req.header("Authorization");
  if (!tokenHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = tokenHeader.substring("Bearer ".length);

  // Se intenta decodificar el token con la clave privada y usa su payload
  // para configurar el parámetro adecuado de id en la solicitud.
  try {
    const { id, type } = JWT.verify(token, secretKey) as { id: string, type: string };

    if (type == "user") {
      req.userId = id;
    }
    else {
      req.companyId = id;
    }
    
    next();
  }
  // Si el token es inválido se atrapa su error y se devuelve un error 401.
  catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}