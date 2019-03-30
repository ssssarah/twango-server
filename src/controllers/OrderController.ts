import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {Order} from "../entity/Order";
import {User} from "../entity/User";
import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {OrderItem} from "../entity/OrderItem";


class OrderController { //TODO copy pasted this from superOrder, adapt it to order


    static getOrder = async (req: Request, res: Response) => {
        /*const id: number = req.params.id;
        const OrderRepository = getRepository(Order);

        try {
            const Order = await OrderRepository.findOneOrFail(id, {select: ["id"]});
            res.send(Order);
        } catch (error) {
            res.status(404).send("Order not found");
        }*/

    };

    static newOrder = async (req: Request, res: Response) => {

        const user: User = res.locals.user;
        let {superOrderId, dispatch, items} = req.body;
        let superOrder: SuperOrder;

        try{
            superOrder = await getRepository(SuperOrder).findOne(superOrderId);
        }
        catch(err) {
            res.status(401).send({error: "SuperOrder not found"});
            return;
        }

        let order = new Order();
        order.superOrder = superOrder;
        order.user = user;

        if(
            (dispatch != Dispatch.PICKUP && dispatch != Dispatch.DELIVERY) ||
            (superOrder.availableDispatch == Dispatch.DELIVERY && dispatch != Dispatch.DELIVERY) ||
            (superOrder.availableDispatch == Dispatch.PICKUP && dispatch != Dispatch.PICKUP)
        ){
            res.status(401).send({error: "Invalid dispatch"});
            return;
        }

        order.dispatch = dispatch;

        for(let key in items){
            let item = items[key];
            let orderItem = new OrderItem();
            orderItem.additionalInfo = item.additionalInfo;
            orderItem.quantity = item.quantity;
            order.orderItems.push(orderItem);
        }

        const orderRepository = getRepository(Order);
        const errors = await validate(order);

        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        try{
            await orderRepository.save(order);
        }
        catch (error) {
            res.status(409).send({error: error.message});
            return;
        }
        res.status(201).send(order);

    };

    static editOrder = async (req: Request, res: Response) => {
        /*let {stuff} = req.body; //TODO

        let id = req.params.id;

        const OrderRepository = getRepository(Order);

        let order: Order;

        try {
            order = await OrderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Order not found");
            return;
        }

        //TODO*/
    };

    static deleteOrder = async (req: Request, res: Response) => {
        /*const id = req.params.id;

        const orderRepository = getRepository(Order);
        let order: Order;

        try {
            order = await orderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        orderRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();*/
    };
};

export default OrderController;

