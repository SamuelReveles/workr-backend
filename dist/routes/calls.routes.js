"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const calls_controller_1 = require("../controllers/calls.controller");
const callsContextValidation_1 = require("../middlewares/callsContextValidation");
const router = (0, express_1.Router)();
router.use(jwtAuth_1.verifyJWT);
router.use(callsContextValidation_1.validateCallRequestContext);
router.get("/access_token", calls_controller_1.generateEmployeeCallAccessToken);
router.get("/company_call_directory", calls_controller_1.getEmployeeCompanyCallDirectory);
router.get("/users_in_call", calls_controller_1.getUsersInCompanyCall);
exports.default = router;
//# sourceMappingURL=calls.routes.js.map