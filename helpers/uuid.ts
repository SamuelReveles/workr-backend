import { v4 as uuidv4 } from "uuid";

/**
 * Crea un id único usando uuid.
 * @returns Cadena de 36 caracteres que contiene el id único.
 */
export function generateUUID(): string {
  return uuidv4();
}