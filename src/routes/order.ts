import {Router} from "express";
import OrderController from "../controllers/OrderController";
import {checkJwtMandatory} from "../middlewares/checkJwt";

const router = Router();

// Get one Order
//router.get("/:id([0-9]+)", OrderController.getOneById);

//Create a new Order
router.post(
    "/",
    [checkJwtMandatory],
    OrderController.newOrder
);

//Edit one Order
router.put(
    "/:id([0-9]+)",
    [checkJwtMandatory],
    OrderController.editOrder
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwtMandatory],
    OrderController.deleteOrder
);

router.put("/status",
    [checkJwtMandatory],
    OrderController.changeOrderStatus
);

export default router;
