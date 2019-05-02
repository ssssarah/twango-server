import {Router} from "express";
import OrderController from "../controllers/OrderController";
import {checkJwtMandatory} from "../middlewares/checkJwt";

const router = Router();

//Create a new Order
router.post(
    "/",
    [checkJwtMandatory],
    OrderController.newOrder
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
