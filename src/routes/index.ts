import { Router, Request, Response } from "express";

import auth from "./auth";
import user from "./user";
import superOrder from "./superOrder";
import order from "./order";
import orderItem from "./orderItem";

const routes = Router();

routes.use("/", auth);
routes.use("/user", user);
routes.use("/superOrder", superOrder);
routes.use("/order", order);
routes.use("/orderItem", orderItem);

export default routes;
