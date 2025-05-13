"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
* Middleware para verificar el JWT de una solicitud, si es válido
* incluye el parámetro apropiado de id según el tipo de token a la request.
*/
function verifyJWT(req, res, next) {
    // Se obtiene la llave privada para JWT's configurada en el entorno.
    const secretKey = process.env.JWT_SECRET_KEY;
    const tokenHeader = req.header("Authorization");
    if (!tokenHeader) {
        return res.status(401).json({ error: "Access denied" });
    }
    const token = tokenHeader.substring("Bearer ".length);
    // Se intenta decodificar el token con la clave privada y usa su payload
    // para configurar el parámetro adecuado de id en la solicitud.
    try {
        const { id, type } = jsonwebtoken_1.default.verify(token, secretKey);
        if (type == "user") {
            req.userId = id;
        }
        else {
            req.companyId = id;
        }
        next();
    }
    // Si el token es inválido se atrapa su error y se devuelve un error 401.
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
//# sourceMappingURL=jwtAuth.js.map