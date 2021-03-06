import {Router} from "express";
import SuperOrderController from "../controllers/SuperOrderController";
import {checkJwtMandatory, checkJwtOptional} from "../middlewares/checkJwt";

const router = Router();

// Get one superOrder
router.get(
    "/:id([0-9]+)", [checkJwtOptional],
    SuperOrderController.getSuperOrder
);

//Create a new superOrder
router.post(
    "/",
    [checkJwtMandatory],
    SuperOrderController.newSuperOrder
);

//Edit superOrder's img
router.put(
    "/:id([0-9]+)/image",
    [checkJwtMandatory],
    SuperOrderController.editImage
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwtMandatory],
    SuperOrderController.deleteSuperOrder
);

// Search SuperOrders
router.get(
    "/search",
    SuperOrderController.search
);

// Get My SuperOrders
router.get(
    "/mine",
    [checkJwtMandatory],
    SuperOrderController.getMySuperOrders
);

// Get my orders' superOrders
router.get(
    "/joined",
    [checkJwtMandatory],
    SuperOrderController.getMyOrdersSuperOrders
);

export default router;