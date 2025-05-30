"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.isPasswordEqualToStored = isPasswordEqualToStored;
exports.isAPIKeyValid = isAPIKeyValid;
const crypto_1 = require("crypto");
const node_buffer_1 = require("node:buffer");
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
    const storedPasswordBuffer = node_buffer_1.Buffer.from(storedPasswordHash, "hex");
    const inputPasswordBuffer = createHashBuffer(inputPassword, salt);
    return (0, crypto_1.timingSafeEqual)(storedPasswordBuffer, inputPasswordBuffer);
}
/**
 * Verifica una API key provista usando un método seguro
 * que evita mostrar información de temporización.
 * @param inputKey Key a contrastar con la API key real.
 * @returns True si la key corresponde con la API key real, False de otro modo.
 */
function isAPIKeyValid(inputKey) {
    const apiKey = process.env.API_KEY;
    if (apiKey === undefined || apiKey === "") {
        throw new Error("Incorrecta configuración de API key");
    }
    // Se generan buffers para poder comparar ambas keys de forma segura.
    const APIKeyBuffer = node_buffer_1.Buffer.from(apiKey, "hex");
    const inputKeyBuffer = node_buffer_1.Buffer.from(inputKey, "hex");
    // Se verifica que ambas longitudes de buffer sean iguales
    // para poder usar el método de comparación adecuadamente.
    if (APIKeyBuffer.length !== inputKeyBuffer.length) {
        return false;
    }
    // Se comparan los buffers para validar la key en un método seguro ante temporización.
    return (0, crypto_1.timingSafeEqual)(APIKeyBuffer, inputKeyBuffer);
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