"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.isPasswordEqualToStored = isPasswordEqualToStored;
const crypto_1 = require("crypto");
/**
 * Crea un hash de la contraseña indicada.
 * @param password Contraseña a ocultar.
 * @returns Hash de la contraseña ocultada.
 */
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    const buffer = createHashBuffer(password, salt);
    return `${salt}:${buffer.toString("hex")}`;
}
/**
 * Compara una contraseña de entrada con una almacenada con hash para saber si son iguales.
 * @param inputPassword Contraseña de entrada.
 * @param storedPassword Contraseña almacenada en registros.
 * @returns True si las contraseñas son iguales, false de otro modo.
 */
function isPasswordEqualToStored(inputPassword, storedPassword) {
    const [salt, storedPasswordHash] = storedPassword.split(":");
    // Se usan buffers para comparar las contraseñas con timingSafeEqual,
    // para así evitar mostrar información de temporización y
    // mejorar la seguridad.
    const storedPasswordBuffer = Buffer.from(storedPasswordHash, "hex");
    const inputPasswordBuffer = createHashBuffer(inputPassword, salt);
    return (0, crypto_1.timingSafeEqual)(storedPasswordBuffer, inputPasswordBuffer);
}
/**
 * Wrapper del algoritmo de hashing usado con su configuración.
 * @param password Contraseña a ocultar.
 * @param salt Salt a usar en el hash.
 * @returns Buffer que contiene el hash creado para la contraseña.
 */
function createHashBuffer(password, salt) {
    return (0, crypto_1.scryptSync)(password, salt, 64);
}
//# sourceMappingURL=encryption.js.map