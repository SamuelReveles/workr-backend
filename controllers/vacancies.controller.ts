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