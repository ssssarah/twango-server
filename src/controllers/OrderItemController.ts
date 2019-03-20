import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {OrderItem} from "../entity/OrderItem";

class OrderItemController {

    //TODO copy pasted from superOrder, adapt it to order items

    static getOrderItem = async (req: Request, res: Response) => {
        const id: number = req.params.id;
        const orderItemRepository = getRepository(OrderItem);
        try {
            const orderItem = await orderItemRepository.findOneOrFail(id, {select: ["id"]});
            res.send(orderItem);
        } catch (error) {
            res.status(404).send("Order item not found");
        }
    };

    static newOrderItem = async (req: Request, res: Response) => {
        let {user, storeURL, storeLocation, deadline, arrivalLocation, availableDispatch} = req.body;

        let orderItem = new OrderItem();
        const orderItemRepository = getRepository(OrderItem);

        const errors = await validate(orderItem);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await orderItemRepository.save(orderItem);
        } catch (e) {
            res.status(409).send("couldn't create superorder");
            return;
        }

        res.status(201).send("Superorder created");
    };

    static editOrderItem = async (req: Request, res: Response) => {
        let {user, storeURL, storeLocation, deadline, arrivalLocation, availableDispatch} = req.body;

        let id = req.params.id;

        const orderItemRepository = getRepository(OrderItem);

        let orderItem: OrderItem;

        try {
            orderItem = await orderItemRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Superorder not found");
            return;
        }

        const errors = await validate(orderItem);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await orderItemRepository.save(orderItem);
        } catch (e) {
            res.status(409).send("Couldn't save order item");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    static deleteOrderItem = async (req: Request, res: Response) => {
        const id = req.params.id;

        const orderItemRepository = getRepository(OrderItem);
        let orderItem: OrderItem;

        try {
            orderItem = await orderItemRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        orderItemRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };


}

export default OrderItemController;

