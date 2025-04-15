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