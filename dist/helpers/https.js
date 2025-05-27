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
exports.makeHttpsRequest = makeHttpsRequest;
const node_https_1 = __importDefault(require("node:https"));
/**
 * Hace una solicitud HTTPS asíncronamente con las opciones dadas.
 * @param options Opciones de configuración para la solicitud HTTPS.
 * @returns Una promise que se resuelve con un json de los datos de respuesta
 * de la solicitud si se completa sin errores, o bien se rechaza la promise
 * si ocurre algún error.
 */
function makeHttpsRequest(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const REQUEST = node_https_1.default.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    resolve(JSON.parse(data));
                });
            });
            REQUEST.on("error", (err) => {
                reject(err);
            });
            REQUEST.end();
        });
    });
}
//# sourceMappingURL=https.js.map