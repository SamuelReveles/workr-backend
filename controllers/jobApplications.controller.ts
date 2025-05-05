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