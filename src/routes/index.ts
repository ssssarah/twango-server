import { Router} from "express";

import auth from "./auth";
import user from "./user";
import superOrder from "./superOrder";
import order from "./order";

const routes = Router();

routes.use("/", auth);
//routes.use("/user", user);
routes.use("/superOrder", superOrder);
routes.use("/order", order);

export default routes;
