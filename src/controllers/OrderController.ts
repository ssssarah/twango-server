import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {Order, Status} from "../entity/Order";
import {User} from "../entity/User";
import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {OrderItem} from "../entity/OrderItem";


class OrderController {


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
            superOrder = await getRepository(SuperOrder).findOneOrFail(superOrderId);
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
        order.status = Status.PENDING;

        order.orderItems = [];

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
        res.status(201).send({"order":order});

    };

    static editOrder = async (req: Request, res: Response) => {
        /*let {stuff} = req.body; //TODO define if it can be done??

        let id = req.params.id;

        const OrderRepository = getRepository(Order);

        let order: Order;

        try {
            order = await OrderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Order not found");
            return;
        }

        */
    };

    static deleteOrder = async (req: Request, res: Response) => {
        const id = req.params.id;

        const orderRepository = getRepository(Order);
        let order: Order;

        try {
            order = await orderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({error: "Order not found"});
            return;
        }

        let user : User = res.locals.user;
        if(order.userId != user.id){
            res.status(401).send();
            return;
        }

        order.isDeleted = true;
        await orderRepository.save(order);
        res.status(200).send({success: "Order deleted"});
    };

    static changeOrderStatus = async (req: Request, res: Response) => {
        const {status, orderId} = req.body;
        let user : User = res.locals.user;
        let order;
        let orderRepository = getRepository(Order);

        try{
            order = await orderRepository.findOneOrFail(
            {id: orderId, isDeleted: false},
            {relations: ["superOrder"]}
            );
        }
        catch(err){
            res.status(404).send({error: "Order not found"});
            return;
        }

        if(order.superOrder.userId != user.id){
            res.status(401).send();
            return;
        }

        if(status != "ACCEPTED" && status != "REFUSED"){
            console.log(status);
            res.status(400).send({error: "Invalid status"});
            return;
        }

        if(order.status != Status.PENDING){
            res.status(400).send({error: "Can't change this order's status"});
            return;
        }

        order.status = <Status>Status[status];
        await orderRepository.save(order);
        res.status(200).send({success: `Successfully changed order ${orderId} status to ${status}`});

    }
}

export default OrderController;

