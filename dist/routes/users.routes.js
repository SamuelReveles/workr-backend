"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const users_1 = require("../middlewares/users");
const jwtAuth_1 = require("../middlewares/jwtAuth");
const profilePicture_1 = require("../middlewares/profilePicture");
const router = (0, express_1.Router)();
router.post("/register", [...users_1.register], users_controller_1.registerUser);
router.post("/update_profile", [jwtAuth_1.verifyJWT, profilePicture_1.verifyProfilePicture, ...users_1.updateProfile], users_controller_1.updateUserProfile);
router.get("/profile/:userId", jwtAuth_1.verifyJWT, users_controller_1.getUserProfile);
router.get("/profile_picture/:id", jwtAuth_1.verifyJWT, users_controller_1.getProfilePicture);
router.get("/notifications", [jwtAuth_1.verifyJWT], users_controller_1.getNotifications);
exports.default = router;
//# sourceMappingURL=users.routes.js.map