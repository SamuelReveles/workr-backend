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

/**
 * Obtiene la información del perfil correspondiente al usuario cuyo id
 * se referencia en los parámetros del endpoint.
 * @returns HTTP 200 con los datos del perfil si se encuentra,
 * HTTP 404 si no se encuentra el perfil,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.getProfile(req.params.userId);
        
        if (profile == null) {
            return res.sendStatus(404);
        }
        else {
            return res.status(200).json(profile);
        }
    }
    catch(err) {
        return res.sendStatus(500);
    }
}

/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getProfilePicture = (req, res) => {
    try {
        const profilePicturePath = UserProfile.getProfilePicturePath(req.params.id);

        if (profilePicturePath == null) {
            return res.sendStatus(404);
        }
        else {
            return res.status(200).sendFile(profilePicturePath);
        }
    }
    catch (err) {
        return res.sendStatus(500);
    }
}