import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import superOrder from "./superOrder";
import superOrders from "./superOrders";
import order from "./order";


const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/superOrder", superOrder);
routes.use("/superOrders", superOrders);
routes.use("/order", order);

export default routes;
