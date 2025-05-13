"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/login", [...auth_1.login], auth_controller_1.validateLogin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map