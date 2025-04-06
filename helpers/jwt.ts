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
* Verifica un token identificador de un usuario.
* @param token Token a verificar.
* @returns Payload del token verificado en caso de ser válido,
* o null en caso de ser inválido.
*/
export function verifyJWT(token: string) {
  // Inicializa la clave privada usada en JWT si aún no se ha obtenido.
  if(!secretKey) {
      init();
  }

  // Se intenta decodificar el token con la clave privada y se retorna
  // su payload en caso de ser validado.
  try {
      const decoded = JWT.verify(token, secretKey);
      return decoded;
  }
  // Si el token es inválido se atrapa su error y se devuelve null.
  catch (error) {
      console.error("JWT verification failed:\n", error.message)
      return null;
  }
}