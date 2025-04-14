import Company from "../models/Company"

export const registerCompany = async (req, res) => {
  try {
    await Company.register(req.files.profile_picture, req.body);
    return res.sendStatus(201);
  }
  catch (err) {
    return res.sendStatus(500);
  }
}