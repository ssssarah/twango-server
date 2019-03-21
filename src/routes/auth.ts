import { Router } from "express";
import AuthController from "../controllers/AuthController";
import {checkJwtOptional, checkJwtMandatory} from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Register
router.post("/register", AuthController.register);

//Change my password
router.post("/change-password", [checkJwtMandatory], AuthController.changePassword);

export default router;