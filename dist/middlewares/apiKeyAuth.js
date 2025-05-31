"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAPIKey = verifyAPIKey;
const encryption_1 = require("../helpers/encryption");
/**
 * Verifica que la api key sea correcta para las
 * solicitudes fuera de la fase de desarrollo.
 */
function verifyAPIKey(req, res, next) {
    // Se evita el almacenamiento de la respuesta en cachés
    // para proteger el header de la api key.
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    if (process.env.ENV !== "dev") {
        try {
            const apiKey = req.header("Api-Key");
            if (!apiKey || !(0, encryption_1.isAPIKeyValid)(apiKey)) {
                return res.sendStatus(401);
            }
        }
        catch (err) {
            return res.sendStatus(401);
        }
    }
    // Tras una validación correcta se pasa al siguiente middleware.
    next();
}
//# sourceMappingURL=apiKeyAuth.js.map