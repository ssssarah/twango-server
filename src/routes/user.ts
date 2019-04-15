import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwtMandatory, checkJwtOptional } from "../middlewares/checkJwt";

const router = Router();

// Get Profile
router.get(
    "/profile",
    [checkJwtMandatory],
    UserController.getProfile
);

// Get one user
router.get(
  "/:id([0-9]+)",
  UserController.getOneById
);

//Edit one user
router.put(
  "/profile",
  [checkJwtMandatory],
  UserController.editUser
);

export default router;