import https from "node:https";

/**
 * Hace una solicitud HTTPS asíncronamente con las opciones dadas.
 * @param options Opciones de configuración para la solicitud HTTPS.
 * @returns Una promise que se resuelve con un json de los datos de respuesta
 * de la solicitud si se completa sin errores, o bien se rechaza la promise
 * si ocurre algún error.
 */
export async function makeHttpsRequest(options: https.RequestOptions) {
  return new Promise((resolve, reject) => {
    const REQUEST = https.request(options, (res) => {
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
}