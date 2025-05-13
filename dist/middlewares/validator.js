"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const express_validator_1 = require("express-validator");
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const validator = (req, res, next) => {
    const errorFormatter = msg => { return msg; };
    const result = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        const errors = { 'errors': { 'body': result.array() } };
        return res.status(400).json(errors);
    }
    return next();
};
exports.validator = validator;
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//# sourceMappingURL=validator.js.map