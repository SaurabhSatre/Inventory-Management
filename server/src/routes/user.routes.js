import express from "express";
import registerUserController from "../controllers/signup.controller.js";
import loginUserController from "../controllers/login.controller.js";
import authenticateUserMiddleware from "../middlewares/authenticateUser.middleware.js";
//import getUserInfoController from "../controllers/getUserInfo.controller.js";

const router = express.Router();

router.post("/user/signup" , registerUserController);
router.post("/user/login" , loginUserController);

// router.get("/user/info" , authenticateUserMiddleware , getUserInfoController);

export default router;