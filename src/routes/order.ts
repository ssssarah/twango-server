import { Router } from "express";
  import OrderController from "../controllers/OrderController";
  import { checkJwt } from "../middlewares/checkJwt";

  const router = Router();

  // Get one superorder
  router.get(
    "/:id([0-9]+)",
    OrderController.getOneById
  );

  //Create a new Order
  router.post("/", [checkJwt], OrderController.newOrder);

  // //Edit one superOrder
  // router.put(
  //   "/:id([0-9]+)",
  //   [checkJwt],
  //   SuperOrderController.newSuperOrder
  // );

  // //Delete one user
  // router.delete(
  //   "/:id([0-9]+)",
  //   [checkJwt],
  //   SuperOrderController.deleteSuperOrder
  // );

  export default router;