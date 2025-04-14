import JWT, { SignOptions } from "jsonwebtoken";

/**
* Crea un Json Web Token para un usuario identificado.
* @param userId Id del usuario.
* @returns Token generado para almacenamiento en el cliente.
*/
export function generateJWT(userId: string) {
  // Se obtiene la llave privada para JWT's configurada en el entorno.
  const secretKey = process.env.JWT_SECRET_KEY;

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

