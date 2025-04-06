import User from "../models/User";

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