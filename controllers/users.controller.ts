import User from "../models/User";
import { generateJWT, verifyJWT } from "../helpers/jwt";

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



    


