import User from "../models/User";
import { generateJWT, verifyJWT } from "../helpers/jwt";
import { generateUUID } from "../helpers/uuid";

// TODO: Crear endpoint de producción con validación de contraseña.
// Endpoint temporal para probar JWT.
export const testJWT = (req, res) => {
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

// TODO: Cambiar por endpoint de producción con esquema real de usuario.
// Endpoint temporal para probar registro de usuarios con hasheo de contraseña.
export const testRegisterUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    }
    
    const correctCreation = await User.create(email, password);

    return res.sendStatus(correctCreation ? 201 : 500);
}

// TODO: Cambiar por endpoint de producción con validación de login y generación de JWT.
// Endpoint temporal para probar validación de contraseña hasheada.
export const testPasswordValidation = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    }

    const validationStatus = await User.validateCredentials(email, password);

    return res.sendStatus(validationStatus);
}

// TODO: Implementar UUID al registrar usuarios.
// Endpoint temporal para probar generación de UUID.
export const testUUID = (req, res) => {
    const id = generateUUID();
    return res.status(200).json(id);
}