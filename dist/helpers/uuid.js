"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
const uuid_1 = require("uuid");
/**
 * Crea un id único usando uuid.
 * @returns Cadena de 36 caracteres que contiene el id único.
 */
function generateUUID() {
    return (0, uuid_1.v4)();
}
//# sourceMappingURL=uuid.js.map