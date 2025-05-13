"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacancies_controller_1 = require("../controllers/vacancies.controller");
const vacancies_1 = require("../middlewares/vacancies");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const router = (0, express_1.Router)();
router.post("/post", [jwtAuth_1.verifyJWT, ...vacancies_1.post], vacancies_controller_1.postVacancy);
router.get("/company_vacancies", [jwtAuth_1.verifyJWT], vacancies_controller_1.getCompanyVacancies);
router.get("/search_vacancy", [jwtAuth_1.verifyJWT, ...vacancies_1.search], vacancies_controller_1.searchVacancy);
router.get("/details/:vacancyId", [jwtAuth_1.verifyJWT], vacancies_controller_1.getVacancyDetails);
router.post("/close_vacancy/:vacancyId", [jwtAuth_1.verifyJWT], vacancies_controller_1.closeVacancy);
exports.default = router;
//# sourceMappingURL=vacancies.routes.js.map