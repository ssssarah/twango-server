import { Router } from "express";
  import SuperOrderController from "../controllers/SuperOrderController";
  import { checkJwt } from "../middlewares/checkJwt";

  const router = Router();

  // Get one superOrder
  router.get(
    "/:id([0-9]+)",
    SuperOrderController.getOneById
  );

  //Create a new superOrder
  router.post("/", [checkJwt], SuperOrderController.newSuperOrder);

  //Edit one superOrder
  router.put(
    "/:id([0-9]+)",
    [checkJwt],
    SuperOrderController.newSuperOrder
  );

  //Delete one user
  router.delete(
    "/:id([0-9]+)",
    [checkJwt],
    SuperOrderController.deleteSuperOrder
  );

  export default router;