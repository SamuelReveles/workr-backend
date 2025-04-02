import { RowDataPacket } from "mysql2";
import { executeQuery } from "../database/connection";
import JWT, { SignOptions } from "jsonwebtoken";
import User from "../models/User";

let secretKey;

export const pong = (req, res) => {
    return res.status(200).json('pong');
}

// TODO: Eliminar este endpoint en desarrollo posterior.
// Endpoint de prueba de BD.
export const fetchInfo = async (req, res) => {
    const query = "SELECT * FROM Users"
    const results: RowDataPacket[] = await executeQuery(query, null)
    console.log(results)

    return res.status(200).json("correct request");
}

// TODO: Crear endpoint de producción con validación de contraseña.
// Endpoint temporal para probar JWT.
export const authenticateUser = (req, res) => {
    // Creación del token.
    const user: User = new User("John Doe", "john_awesome_doe", 40, "red");
    const userToken = generateJWT(user);
    console.log("Generated token:\n", userToken);

    // Validación del token
    const decodedToken = verifyJWT(userToken);
    if(decodedToken) {
        console.log("Decoded JWT payload:\n", decodedToken);
    }
    
    // Envío del token al cliente.
    return res.status(200).json({ token: userToken });
}

// Inicialización de la clave privada usada en JWT.
function init() {
    secretKey = process.env.JWT_SECRET_KEY;
}

/**
 * Crea un Json Web Token para un usuario especificado.
 * @param user Usuario autenticado.
 * @returns Token generado para almacenamiento en el cliente.
 */
function generateJWT(user: User) {
    // Inicializa la clave privada usada en JWT si aún no se ha obtenido.
    if(!secretKey) {
        init();
    }

    // Datos del usuario a incluir en el token.
    const payload = {
        userId: user.id,
        userName: user.name,
    };
    
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
function verifyJWT(token: string) {
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