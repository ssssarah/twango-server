import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import superOrder from "./superOrder";
import superOrders from "./superOrders";


const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/superOrder", superOrder);
routes.use("/superOrders", superOrders);

export default routes;
