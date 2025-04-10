/**
 * Obtiene la fecha actual y la devuelve en una cadena con formato AAAA-MM-DD.
 * @returns Cadena que contiene la fecha actual.
 */
export function getDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}