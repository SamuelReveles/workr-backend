"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveNewProfilePicture = saveNewProfilePicture;
exports.deleteProfilePictureFile = deleteProfilePictureFile;
exports.resolveProfilePicturePath = resolveProfilePicturePath;
const fs_1 = require("fs");
const uuid_1 = require("./uuid");
const path_1 = require("path");
/**
 * Guarda la foto de perfil provista en el archivo de entrada y devuelve su id para referencia.
 * @param profilePictureFile Archivo de foto de perfil a guardar.
 * @param directory Directorio donde se guardará la foto de perfil.
 * @returns Id para referenciar la nueva foto de perfil.
 */
function saveNewProfilePicture(profilePictureFile, directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExtension = profilePictureFile.name.split(".").pop();
        const imageUUID = (0, uuid_1.generateUUID)();
        const newProfilePictureId = `${imageUUID}.${fileExtension}`;
        yield profilePictureFile.mv(`${directory}/${newProfilePictureId}`);
        return newProfilePictureId;
    });
}
/**
 * Borra el archivo especificado de foto de perfil de un usuario.
 * @param profilePictureId Identificador de la foto de perfil a borrar.
 * @param directory Directorio de donde se borrará la foto de perfil.
 */
function deleteProfilePictureFile(profilePictureId, directory) {
    const fileLocation = `${directory}/${profilePictureId}`;
    (0, fs_1.rmSync)(fileLocation, { force: true });
}
/**
 * Resuelve la ruta absoluta a una foto de perfil referenciada si existe.
 * @param directory Directorio donde se busca la foto de perfil.
 * @param id Identificador de la foto cuya ruta resuelta se busca.
 * @returns Ruta absoluta para la foto de perfil si existe,
 * null de otro modo.
 */
function resolveProfilePicturePath(directory, id) {
    const path = `${directory}/${id}`;
    return (0, fs_1.existsSync)(path) ? (0, path_1.resolve)(path) : null;
}
//# sourceMappingURL=profilePictures.js.map