import { existsSync, rmSync } from "fs";
import { generateUUID } from "./uuid";
import { resolve } from "path";

/**
 * Guarda la foto de perfil provista en el archivo de entrada y devuelve su id para referencia.
 * @param profilePictureFile Archivo de foto de perfil a guardar.
 * @param directory Directorio donde se guardará la foto de perfil.
 * @returns Id para referenciar la nueva foto de perfil.
 */
export async function saveNewProfilePicture(profilePictureFile, directory: string) {
  const fileExtension = profilePictureFile.name.split(".").pop();
  const imageUUID = generateUUID();
  const newProfilePictureId = `${imageUUID}.${fileExtension}`;
  await profilePictureFile.mv(`${directory}/${newProfilePictureId}`);
  return newProfilePictureId;
}

/**
 * Borra el archivo especificado de foto de perfil de un usuario.
 * @param profilePictureId Identificador de la foto de perfil a borrar.
 * @param directory Directorio de donde se borrará la foto de perfil.
 */
export function deleteProfilePictureFile(profilePictureId: string, directory: string) {
  const fileLocation = `${directory}/${profilePictureId}`;
  rmSync(fileLocation, { force: true });
}

/**
 * Resuelve la ruta absoluta a una foto de perfil referenciada si existe.
 * @param directory Directorio donde se busca la foto de perfil.
 * @param id Identificador de la foto cuya ruta resuelta se busca.
 * @returns Ruta absoluta para la foto de perfil si existe,
 * null de otro modo.
 */
export function resolveProfilePicturePath(directory: string, id: string) {
  const path = `${directory}/${id}`;
  return existsSync(path) ? resolve(path) : null;
}