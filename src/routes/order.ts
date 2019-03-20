import {Router} from "express";
import OrderController from "../controllers/OrderController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router();

// Get one Order

//router.get("/:id([0-9]+)", OrderController.getOneById);

//Create a new Order
router.post(
    "/",
    [checkJwt],
    OrderController.newOrder
);

//Edit one Order
router.put(
    "/:id([0-9]+)",
    [checkJwt],
    OrderController.editOrder
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt],
    OrderController.deleteOrder
);

// Search Orders
// router.get("/search", OrderController.search);

export default router;
