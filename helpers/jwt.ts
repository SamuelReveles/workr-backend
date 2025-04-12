import JWT, { SignOptions } from "jsonwebtoken";
import User from "../models/User";

let secretKey;

// Inicialización de la clave privada usada en JWT.
function init() {
  secretKey = process.env.JWT_SECRET_KEY;
}

/**
* Crea un Json Web Token para un usuario identificado.
* @param userId Id del usuario.
* @returns Token generado para almacenamiento en el cliente.
*/
export function generateJWT(userId: string) {
  // Inicializa la clave privada usada en JWT si aún no se ha obtenido.
  if(!secretKey) {
      init();
  }

  // Datos del usuario a incluir en el token.
  const payload = { userId };
  
  // Configuración del token, por ejemplo su expiración.
  const options: SignOptions = {
      expiresIn: "1h",
  };
  
  // Generación y firmado del token.
  const token = JWT.sign(payload, secretKey, options);
  return token;
}

/**
* Middleware para verificar el JWT de una solicitud,
* si es válido incluye el parámetro userId a la request con
* el id obtenido del JWT.
*/
export function verifyJWT(req, res, next) {
  // Inicializa la clave privada usada en JWT si aún no se ha obtenido.
  if(!secretKey) {
      init();
  }

  const token = req.header("Authorization");
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