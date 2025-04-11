import User from "../models/User";

/**
 * Registra un nuevo usuario con los parámetros indicados en body.
 * @returns HTTP 201 si el usuario se registra correctamente,
 * HTTP 400 si los parámetros son incorrectos,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const registerUser = async (req, res) => {
    const { fullName, email, password, country } = req.body;

    try {
        await User.create(fullName, email, password, country);
        return res.sendStatus(201);
    }
    catch(e) {
        return res.sendStatus(500);
    }
}

/**
 * Verifica las credenciales de acceso de un usuario indicadas en body
 * @returns HTTP 200 con un JWT de autenticación si las credenciales son correctas,
 * HTTP 400 si los parámetros son incorrectos,
 * HTTP 401 si las credenciales son incorrectas al autenticar,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const validateLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        return await User.validateCredentials(email, password)
            .then(jwt => res.status(200).json({ jwt }))
            .catch(_ => res.sendStatus(401));
    }
    catch(e) {
        return res.sendStatus(500);
    }
}