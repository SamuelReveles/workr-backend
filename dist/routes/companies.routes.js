"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companies_controller_1 = require("../controllers/companies.controller");
const companies_1 = require("../middlewares/companies");
const profilePicture_1 = require("../middlewares/profilePicture");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const router = (0, express_1.Router)();
router.post("/register", [profilePicture_1.verifyProfilePicture, ...companies_1.register], companies_controller_1.registerCompany);
router.post("/update_profile", [jwtAuth_1.verifyJWT, profilePicture_1.verifyProfilePicture, ...companies_1.updateProfile], companies_controller_1.updateCompanyProfile);
router.get("/profile/:companyId", jwtAuth_1.verifyJWT, companies_controller_1.getCompanyProfile);
router.get("/profile_picture/:id", jwtAuth_1.verifyJWT, companies_controller_1.getProfilePicture);
exports.default = router;
//# sourceMappingURL=companies.routes.js.map