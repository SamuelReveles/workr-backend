import { randomBytes, scryptSync, timingSafeEqual } from "crypto"
import { Buffer } from "node:buffer";

/**
 * Crea un hash de la contraseña indicada.
 * @param password Contraseña a ocultar.
 * @returns Hash de la contraseña ocultada.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const buffer = createHashBuffer(password, salt);
  return `${salt}:${buffer.toString("hex")}`;
}

/**
 * Compara una contraseña de entrada con una almacenada con hash para saber si son iguales.
 * @param inputPassword Contraseña de entrada.
 * @param storedPassword Contraseña almacenada en registros.
 * @returns True si las contraseñas son iguales, false de otro modo.
 */
export function isPasswordEqualToStored(inputPassword: string, storedPassword: string): boolean {
  const [salt, storedPasswordHash] = storedPassword.split(":");

  // Se usan buffers para comparar las contraseñas con timingSafeEqual,
  // para así evitar mostrar información de temporización y
  // mejorar la seguridad.
  const storedPasswordBuffer = Buffer.from(storedPasswordHash, "hex");
  const inputPasswordBuffer = createHashBuffer(inputPassword, salt);
  return timingSafeEqual(storedPasswordBuffer, inputPasswordBuffer);
}

/**
 * Verifica una API key provista usando un método seguro
 * que evita mostrar información de temporización.
 * @param inputKey Key a contrastar con la API key real.
 * @returns True si la key corresponde con la API key real, False de otro modo.
 */
export function isAPIKeyValid(inputKey: string) {
  const apiKey = process.env.API_KEY;
  if (apiKey === undefined || apiKey === "") {
    throw new Error("Incorrecta configuración de API key");
  }

  // Se generan buffers para poder comparar ambas keys de forma segura.
  const APIKeyBuffer = Buffer.from(apiKey, "hex");
  const inputKeyBuffer = Buffer.from(inputKey, "hex");

  // Se verifica que ambas longitudes de buffer sean iguales
  // para poder usar el método de comparación adecuadamente.
  if (APIKeyBuffer.length !== inputKeyBuffer.length) {
    return false;
  }

  // Se comparan los buffers para validar la key en un método seguro ante temporización.
  return timingSafeEqual(APIKeyBuffer, inputKeyBuffer);
}

/**
 * Wrapper del algoritmo de hashing usado con su configuración.
 * @param password Contraseña a ocultar.
 * @param salt Salt a usar en el hash.
 * @returns Buffer que contiene el hash creado para la contraseña.
 */
function createHashBuffer(password: string, salt: string): Buffer {
  return scryptSync(password, salt, 64);
}