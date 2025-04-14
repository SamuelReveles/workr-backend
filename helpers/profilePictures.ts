import { generateUUID } from "./uuid";

/**
   * Guarda la foto de perfil provista en el archivo de entrada y devuelve su id para referencia.
   * @param profilePictureFile Archivo de foto de perfil a guardar.
   * @returns Id para referenciar la nueva foto de perfil.
   */
export async function saveNewProfilePicture(profilePictureFile, directory) {
  const fileExtension = profilePictureFile.name.split(".").pop();
  const imageUUID = generateUUID();
  const newProfilePictureId = `${imageUUID}.${fileExtension}`;
  await profilePictureFile.mv(`${directory}/${newProfilePictureId}`);
  return newProfilePictureId;
}