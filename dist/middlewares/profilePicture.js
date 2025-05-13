"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyProfilePicture = verifyProfilePicture;
/**
 * Middleware para verificar que se adjunte un archivo de imagen
 * con nombre 'profile_picture' en una request.
 */
function verifyProfilePicture(req, res, next) {
    if (!req.files || !req.files.profile_picture) {
        return res.status(400).json({ "error": "Se debe pasar una imagen en el campo 'profile_picture'" });
    }
    const file = req.files.profile_picture;
    if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ "error": "El archivo enviado como 'profile_picture' debe ser una imagen" });
    }
    next();
}
//# sourceMappingURL=profilePicture.js.map