/**
 * Obtiene la fecha actual y la devuelve en una cadena con formato AAAA-MM-DD.
 * @returns Cadena que contiene la fecha actual.
 */
export function getDateString() {
  const date = new Date();
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calcula la cantidad de días que han pasado desde una fecha dada.
 * @param date Fecha desde donde se contarán los días transcurridos.
 * @returns Número de días transcurridos desde la fecha dada hasta hoy.
 */
export function calculateDaysFrom(date: Date) {
  // Se asigna la hora de ambas fechas a la medianoche para una comparación
  // precisa de días sin horas involucradas.
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // Obtención de milisegundos de las fechas para calcular
  // su diferencia de tiempo.
  const currentMillis = currentDate.getTime();
  const dateMillis = date.getTime();
  
  // Se divide la diferencia de milisegundos hasta obtener días y se devuelven.
  return (currentMillis - dateMillis) / 1000 / 60 / 60 / 24;
}

/**
 * Devuelve el instante de tiempo actual en formato HH:MM:SS
 * @returns Una string que contiene la hora actual.
 */
export function getTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/*
 * Obtiene la marca de tiempo actual.
 * @returns Objeto Date que contiene la marca de tiempo actual.
 */
export function getCurrentTime() {
  return new Date();
}

/**
 * Verifica si un texto es una correcta representación de timestamp.
 * @param dateTimeString Texto a validar como timestamp.
 * @returns True si el texto es una adecuada representación de timestamp,
 * False de otro modo.
 */
export function isValidDateTimeString(dateTimeString: string) {
  const date = new Date(dateTimeString);
  return !isNaN(date.getTime());
}