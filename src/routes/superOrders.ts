import { Router } from "express";
  import SuperOrdersController from "../controllers/SuperOrdersController";
  import { checkJwt } from "../middlewares/checkJwt";

  const router = Router();

  // Search SuperOrders
  router.get(
    "/search",
    SuperOrdersController.search
  );



  export default router;