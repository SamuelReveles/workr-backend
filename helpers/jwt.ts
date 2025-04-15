import JWT, { SignOptions } from "jsonwebtoken";

/**
* Crea un Json Web Token para un inicio de sesión correcto.
* @param loginId Id de la entidad validada con el login.
* @param loginType Indicador que diferencia un login de usuario de uno de empresa.
* @returns Token generado para almacenamiento en el cliente.
*/
export function generateJWT(loginId: string, loginType: string) {
  // Se obtiene la llave privada para JWT's configurada en el entorno.
  const secretKey = process.env.JWT_SECRET_KEY;

  // Datos de identificación a incluir en el token.
  const payload = { id: loginId, type: loginType };
  
  // Configuración del token, por ejemplo su expiración.
  const options: SignOptions = {
    expiresIn: "1h",
  };
  
  // Generación y firmado del token.
  const token = JWT.sign(payload, secretKey, options);
  return token;
}

