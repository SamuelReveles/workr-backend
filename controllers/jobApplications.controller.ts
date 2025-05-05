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

/**
 * Obtiene las respuestas al formulario de solicitud de empleo
 * para la solicitud referenciada si es que existe.
 * @returns HTTP 200 con JSON que contiene las respuestas
 * al formulario de solicitud de empleo si se encuentra la solicitud,
 * HTTP 404 si no se encuentra la solicitud de empleo,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const getJobApplicationFormAnswers = async (req, res) => {
  try {
    const formAnswers = await JobApplication.getFormAnswers(req.body.jobApplicationId);

    if (formAnswers != null) {
      return res.status(200).json(formAnswers);
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Registra un agendado de entrevista para una solicitud de empleo referenciada.
 * @returns HTTP 200 si el agendado se registró correctamente,
 * HTTP 404 si no se encontró la solicitud de empleo asociada,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const registerInterview = async (req, res) => {
  try {
    const scheduled = await JobApplication.registerInterview(req.body.jobApplicationId);
    
    if (scheduled != null) {
      return res.sendStatus(200);
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch (err) {
    return res.sendStatus(500);
  }
}