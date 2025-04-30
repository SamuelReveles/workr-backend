import Company from "../models/Company"

/**
 * Registra una empresa tomando los datos de la solicitud.
 * @returns HTTP 201 si la empresa se registra exitosamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const registerCompany = async (req, res) => {
  try {
    await Company.register(req.files.profile_picture, req.body);
    return res.sendStatus(201);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Actualiza los datos de perfil de una empresa tomando los datos de la solicitud.
 * @returns HTTP 200 si la actualización se completa correctamente,
 * HTTP 500 si ocurre algún error al procesar la request.
 */
export const updateCompanyProfile = async (req, res) => {
  try {
    await Company.updateProfile(req.companyId, req.files.profile_picture, req.body);
    return res.sendStatus(200);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Obtiene la información del perfil correspondiente a la empresa cuyo id
 * se referencia en los parámetros del endpoint.
 * @returns HTTP 200 con los datos del perfil si se encuentra,
 * HTTP 404 si no se encuentra el perfil,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getCompanyProfile = async (req, res) => {
  try {
      const profile = await Company.getProfile(req.params.companyId);
      
      if (profile == null) {
          return res.sendStatus(404);
      }
      else {
          return res.status(200).json(profile);
      }
  }
  catch(err) {
      return res.sendStatus(500);
  }
}

/**
 * Devuelve la foto de perfil referenciada con el id en los parámetros del endpoint.
 * @returns HTTP 200 con la foto de perfil solicitada si se encuentra,
 * HTTP 404 si no se encuentra la foto de perfil solicitada,
 * HTTP 500 si ocurre algún error al procesar la solicitud.
 */
export const getProfilePicture = (req, res) => {
  try {
      const profilePicturePath = Company.getProfilePicturePath(req.params.id);

      if (profilePicturePath == null) {
          return res.sendStatus(404);
      }
      else {
          return res.status(200).sendFile(profilePicturePath);
      }
  }
  catch (err) {
      return res.sendStatus(500);
  }
}