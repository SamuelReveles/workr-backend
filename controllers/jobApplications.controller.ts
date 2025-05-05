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

/**
 * Devuelve un listado de los aspirantes que fueron contactados con
 * una entrevista agendada para la vacante referenciada, si existe.
 * @returns HTTP 200 con un JSON que contiene el listado con información
 * resumida de los aspirantes contactados si los datos se obtienen correctamente,
 * HTTP 404 si no se encuentra la vacante referenciada,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const getContactedVacancyApplicants = async (req, res) => {
  try {
    const contactedApplicants = await JobApplication.getContactedVacancyApplicants(req.body.vacancyId);
    
    if (contactedApplicants != null) {
      return res.status(200).json(contactedApplicants);
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
 * Obtiene las notas de entrevista con el id referenciado si existen.
 * @returns HTTP 200 con un JSON que contiene las notas de entrevista
 * si se obtienen correctamente,
 * HTTP 404 si no se encuentran las notas referenciadas,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const getInterviewNotes = async (req, res) => {
  try {
    const interviewNotes = await JobApplication.getInterviewNotes(req.body.interviewNotesId);

    if (interviewNotes != null) {
      return res.status(200).json(interviewNotes);
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
 * Actualiza las notas de una entrevista referenciada.
 * @returns HTTP 200 si las notas se actualizaron correctamente,
 * HTTP 404 si no se encontró un registro para las notas referenciadas,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const updateInterviewNotes = async (req, res) => {
  try {
    const updated = await JobApplication.updateInterviewNotes(
      req.body.interviewNotesId,
      req.body.interviewNotes
    );

    if (updated != null) {
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