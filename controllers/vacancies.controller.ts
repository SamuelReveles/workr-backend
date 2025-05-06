import Vacancy from "../models/Vacancy"

/**
 * Registra una nueva vacante con la información dada en
 * la request.
 * @returns HTTP 201 si la vacante se registra correctamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const postVacancy = async (req, res) => {
  try {
    await Vacancy.postVacancy(req.body, req.companyId);
    return res.sendStatus(201);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Consulta las vacantes publicadas por una empresa autenticada.
 * @returns HTTP 200 con un JSON que contiene los registros de vacantes
 * si la consulta se completa correctamente,
 * HTTP 500 si ocurre algún error al procesar la request.
 */
export const getCompanyVacancies = async (req, res) => {
  try {
    const vacancyData = await Vacancy.getCompanyVacancies(req.companyId);
    return res.status(200).json(vacancyData);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Busca las vacantes que coincidan con los parámetros provistos
 * en la request.
 * @returns HTTP 200 con un JSON que contiene el listado de resultados
 * para la búsqueda de vacantes si se completa correctamente,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const searchVacancy = async (req, res) => {
  try {
    const searchResults = await Vacancy.searchVacancies(req.body);
    return res.status(200).json(searchResults);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}

/**
 * Obtiene los detalles de la vacante indicada en la ruta de solicitud.
 * @returns HTPP 200 con JSON conteniendo los detalles de la vacante
 * referenciada si se obtiene correctamente,
 * HTTP 404 si no se encuentra la vacante referenciada,
 * HTTP 500 si ocurre un error al procesar la request.
 */
export const getVacancyDetails = async (req, res) => {
  try {
    const details = await Vacancy.getVacancyDetails(req.params.vacancyId);

    if (details != null) {
      return res.status(200).json(details);
    }
    else {
      return res.sendStatus(404);
    }
  }
  catch(err) {
    return res.sendStatus(500);
  }
}

/**
 * Cierra una vacante para que ya no aparezca en resultados de búsqueda
 * y no pueda recibir nuevas solicitudes de aspirantes.
 * @returns HTTP 200 si la vacante existe y se cerró correctamente,
 * HTTP 404 si no se encontró la vacante,
 * HTTP 500 si ocurrió un error al procesar la request.
 */
export const closeVacancy = async (req, res) => {
  try {
    const closed = await Vacancy.closeVacancy(req.params.vacancyId);

    if (closed != null) {
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