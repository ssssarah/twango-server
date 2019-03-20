import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {Order} from "../entity/Order";


class OrderController { //TODO copy pasted this from superOrder, adapt it to order


    static getOrder = async (req: Request, res: Response) => {
        const id: number = req.params.id;
        const OrderRepository = getRepository(Order);

        try {
            const Order = await OrderRepository.findOneOrFail(id, {select: ["id"]});
            res.send(Order);
        } catch (error) {
            res.status(404).send("Order not found");
        }

    };

    static newOrder = async (req: Request, res: Response) => {
        let {userId, superOrderId, dispatch} = req.body;

        let order = new Order();
        //TODO fields and possibly orderItems at the same time

        const orderRepository = getRepository(Order);

        const errors = await validate(order);
        if (errors.length > 0) {
            console.log(errors);
            res.status(400).json(errors);
            return;
        }
        try{
            await orderRepository.save(order);
        }
        catch (e) {
            res.status(409).send("couldn't create superorder");
            return;
        }
        console.log("Order id is "+ order.id)
        res.status(201).json({id : order.id});
    };

    static editOrder = async (req: Request, res: Response) => {
        let {stuff} = req.body; //TODO

        let id = req.params.id;

        const OrderRepository = getRepository(Order);

        let order: Order;

        try {
            order = await OrderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Order not found");
            return;
        }

        //TODO
    };

    static deleteOrder = async (req: Request, res: Response) => {
        const id = req.params.id;

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
        res.status(204).send();
    };
};

export default OrderController;

