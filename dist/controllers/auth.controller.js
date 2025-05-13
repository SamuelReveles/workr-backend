"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const Auth_1 = __importDefault(require("../models/Auth"));
/**
 * Verifica las credenciales de acceso indicadas en body
 * @returns HTTP 200 con un JWT de autenticación si las credenciales son correctas,
 * HTTP 400 si los parámetros son incorrectos,
 * HTTP 401 si las credenciales son incorrectas al autenticar,
 * HTTP 500 si ocurre un error al procesar la request.
 */
const validateLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        return yield Auth_1.default.validateCredentials(email, password)
            .then(jwt => res.status(200).json({ jwt }))
            .catch(_ => res.sendStatus(401));
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});
exports.validateLogin = validateLogin;
//# sourceMappingURL=auth.controller.js.map