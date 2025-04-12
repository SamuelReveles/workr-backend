import User from "../models/User";
import UserProfile from "../models/UserProfile";

/**
 * Registra un nuevo usuario con los parámetros indicados en body.
 * @returns HTTP 201 si el usuario se registra correctamente,
 * HTTP 400 si los parámetros son incorrectos,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const registerUser = async (req, res) => {
    const { fullName, email, password, country } = req.body;
    const params = [ fullName, email, password, country ];

    for (const p of params) {
        if(p == null || p === "") {
            return res.sendStatus(400);
        }
    }

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
    const params = [ email, password ];
    for (const p of params) {
        if (p == null || p === "") {
            return res.sendStatus(400);
        }
    }

    try {
        return await User.validateCredentials(email, password)
            .then(jwt => res.status(200).json({ jwt }))
            .catch(_ => res.sendStatus(401));
    }
    catch(e) {
        return res.sendStatus(500);
    }
}

/**
 * Actualiza el perfil de un usuario con los parámetros provistos
 * en la solicitud.
 * @returns HTTP 200 si el perfil se actualizó correctamente,
 * HTTP 500 si ocurrió un error al procesar la request.
 */
export const updateUserProfile = async (req, res) => {
    try {
        await UserProfile.updateProfile(req.userId, req.files.profile_picture, req.body);
        return res.sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500);
    }
}