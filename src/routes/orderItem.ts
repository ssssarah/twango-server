import {Router} from "express";
import OrderItemController from "../controllers/OrderItemController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router();

// Get one OrderItem
// router.get("/:id([0-9]+)", OrderItemController.getOneById);

//Create a new OrderItem
router.post(
    "/",
    [checkJwt],
    OrderItemController.newOrderItem
);

//Edit one OrderItem
router.put(
    "/:id([0-9]+)",
    [checkJwt],
    OrderItemController.editOrderItem
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt],
    OrderItemController.deleteOrderItem
);

// Search OrderItems
// router.get("/search", OrderItemController.search);

export default router;