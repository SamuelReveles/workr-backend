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