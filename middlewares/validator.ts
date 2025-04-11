import { validationResult } from 'express-validator';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const validator = (req, res, next) => {
    const errorFormatter = msg => { return msg };
    const result = validationResult(req).formatWith(errorFormatter);

    if (!result.isEmpty()) {
        const errors = { 'errors': { 'body': result.array() } }
        return res.status(400).json(errors);
    }
    return next();
};
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
