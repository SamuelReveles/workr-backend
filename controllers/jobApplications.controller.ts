import JobApplication from "../models/JobApplication";

/**
 * Registra a un nuevo aspirante autenticado a una vacante usando la
 * información de la solicitud.
 * @returns HTTP 201 si se registra el aspirante correctamente,
 * HTTP 500 si ocurre un error al procesar la solicitud.
 */
export const registerApplicant = async (req, res) => {
  try {
    await JobApplication.register(req.userId, req.body);
    return res.sendStatus(201);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Obtiene los aspirantes a una vacante especificada en la solicitud.
 * @returns HTTP 200 con JSON que contiene un listado con
 * información resumida de los aspirantes a la vacante,
 * HTTP 404 si no se encuentra la vacante indicada,
 * HTTP 500 si ocurre un error al procesar la solicitud.
 */
export const getVacancyApplicants = async (req, res) => {
  try {
    const applicants = await JobApplication.getVacancyApplicants(req.body.vacancyId);

    if (applicants != null) {
      return res.status(200).json(applicants);
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch (err) {
    return res.sendStatus(500);
  }
}