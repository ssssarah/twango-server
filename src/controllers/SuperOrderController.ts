import {Request, Response} from "express";
import {getRepository, SelectQueryBuilder} from "typeorm";
import {validate} from "class-validator";

import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {User} from "../entity/User";
import {Order} from "../entity/Order";

class SuperOrderController {

    static getSuperOrder = async (req: Request, res: Response) => {

        const id: number = req.params.id;
        const user: User = res.locals.user;
        let superOrder: SuperOrder = await getRepository(SuperOrder).createQueryBuilder("superOrder")
            .select(["superOrder", "user.firstName", "user.lastName", "user.id", "user.imageUrl"])
            .leftJoin("superOrder.user", "user")
            .where("superOrder.id = :id", {id: id})
            .andWhere("superOrder.isDeleted = :isDeleted", {isDeleted: false})
            .getOne();

        if(superOrder == null){
            res.status(404).send({error: "SuperOrder not found"});
            return;
        }

        if(user != null){

            let qb =  await getRepository(Order).createQueryBuilder("order");
            //if superOrder is mine, get all orders, else look into the superOrder's orders if one is mine
            if(user.id == superOrder.userId){

                superOrder["orders"] = await qb.select(["order", "user.firstName", "user.lastName", "user.id", "user.imageUrl"])
                    .leftJoin("order.user", "user")
                    .leftJoinAndSelect("order.orderItems", "orderItems")
                    .where("order.superOrderId = :superOrderId", {superOrderId: superOrder.id})
                    .andWhere("order.isDeleted = :isDeleted", {isDeleted: false})
                    .getMany();

            }
            else{
                superOrder["myOrder"] = await qb
                    .where("order.superOrderId = :superOrderId", {superOrderId: superOrder.id})
                    .andWhere("order.isDeleted = :isDeleted", {isDeleted: false})
                    .andWhere("order.userId = :userId", {userId: user.id})
                    .leftJoinAndSelect("order.orderItems", "orderItem")
                    .getOne();
            }
        }

        res.status(200).send({superOrder: superOrder});

    };

    static getMySuperOrders = async (req: Request, res: Response) => {
        const user: User = res.locals.user;
        const superOrders = getRepository(SuperOrder).createQueryBuilder()
            .select(["user.firstName", "user.lastName", "superOrder", "user.id", "user.imageUrl"])
            .from(SuperOrder, "superOrder")
            .where("superOrder.userId = :userId", { userId: user.id })
            .leftJoinAndSelect(
                "superOrder.orders", "order",
                "order.isDeleted = :isDeleted", { isDeleted: false })
            .leftJoin("order.user", "user")
            .leftJoinAndSelect("order.orderItems", "orderItems");

        console.log(superOrders.getSql());

        res.status(200).send({superOrders: await superOrders.getMany()});
    };

    static getMyOrdersSuperOrders = async (req: Request, res: Response) => {
        const user: User = res.locals.user;

        const orders: Order[] = await getRepository(Order).createQueryBuilder("order")
            .select(["order", "user.firstName", "user.lastName", "user.id", "user.imageUrl"])
            .where("order.userId = :userId", { userId: user.id })
            .andWhere("order.isDeleted = :isDeleted", {isDeleted: false})
            .leftJoinAndSelect("order.orderItems", "orderItem")
            .leftJoinAndSelect("order.superOrder", "superOrder")
            .leftJoin("superOrder.user", "user")
            .getMany();

        const superOrders = orders.map((order: Order) => {
            let superOrder = order.superOrder;
            delete order.superOrder;
            superOrder["myOrder"] = order;
            return superOrder;
        });

        res.status(200).send({superOrders: superOrders});
    };

    static newSuperOrder = async (req: Request, res: Response) => {

        const user: User = res.locals.user;

        let {storeURL, storeLocation, deadline, storeName, arrivalLocation, availableDispatch, tags} = req.body;

        let superOrder = new SuperOrder();
        superOrder.user = user;
        superOrder.storeURL = storeURL;
        superOrder.storeLocation = storeLocation;
        superOrder.deadline = deadline;
        superOrder.storeName = storeName;
        superOrder.arrivalLocation = arrivalLocation;
        superOrder.availableDispatch = availableDispatch;
        superOrder.tags = tags.map(el => el.toLowerCase());
        superOrder.isDeleted = false;

        const superOrderRepository = getRepository(SuperOrder);

        const errors = await validate(superOrder, { validationError: { target: false }});

        if (errors.length > 0) {
            console.log(errors);
            res.status(400).json({error: errors});
            return;
        }

        try {
            await superOrderRepository.save(superOrder);
            res.status(201).json({superOrder: superOrder});
        } catch (e) {
            res.status(409).send({error: e.message});
            return;
        }

    };

    static deleteSuperOrder = async (req: Request, res: Response) => {
        const id = req.params.id;

        const superOrderRepository = getRepository(SuperOrder);
        let superOrder: SuperOrder;

        try {
            superOrder = await superOrderRepository.findOneOrFail(
            {id: id, isDeleted: false},
            { relations: ["orders"] }
            );

        } catch (error) {
            res.status(404).send({error: "SuperOrder not found"});
            return;
        }

        let user : User = res.locals.user;
        if(superOrder.userId != user.id){
            res.status(401).send();
            return;
        }

        superOrder.isDeleted = true;
        if(superOrder.orders){
            let orderRepository = getRepository(Order);
            for(let key in superOrder.orders) {
                let order = superOrder.orders[key];
                order.isDeleted = true;
                await orderRepository.save(order);
            }
        }

        await superOrderRepository.save(superOrder);
        res.status(200).send({success: "SuperOrder deleted"});
    };

    static search = async (req: Request, res: Response) => {

        const RESULT_PER_PAGE = 8;
        //let location = req.query.location; //TODO
        let tags = req.query.tags;
        let sortType = req.query.sortType;
        let sortOrder = req.query.sortOrder;
        let page = req.query.page || 1;
        let dispatch = req.query.dispatch;

        try {
            let queryBuilder: SelectQueryBuilder<SuperOrder> = getRepository(SuperOrder)
                                                                .createQueryBuilder("super_order")
                                                                .take(RESULT_PER_PAGE)
                                                                .skip((page-1) * RESULT_PER_PAGE);

            queryBuilder.where("super_order.isDeleted = :isDeleted", {isDeleted: false});
            
            // {type: "deadline", order:"ASC/DESC"}
            if(isDefined(sortType) && isDefined(sortOrder)){
                if(sortOrder != "ASC" && sortOrder != "DESC"){
                    res.status(404).send({error: "Invalid sorting order"});
                    return;
                }

                if(sortType != "deadline" && sortType != "createdAt"){
                    res.status(404).send({error: "Invalid sorting type"});
                    return;
                }

                queryBuilder.orderBy(sortType, sortOrder);
            }

            if(isDefined(tags)){
                //TODO case sensitive????? lowercase at creation & querying?
                if(!Array.isArray(tags)){
                    queryBuilder.where(`super_order.tags like :tag 
                                                 or super_order.storeName like :tag`, {tag: `%${tags}%`});
                }
                else{
                    for(let key in tags){
                        let obj = {};
                        obj[`tag${key}`] = `%${tags[key]}%`;
                        queryBuilder.orWhere(`super_order.tags like :tag${key} 
                                                     or super_order.storeName like :tag${key}`, obj);
                    }
                }
            } //TODO multiple tags search doesn't work....

            if(isDefined(dispatch)){
                if(dispatch != Dispatch.DELIVERY && dispatch != Dispatch.PICKUP){
                    res.status(404).send({error: "Invalid dispatch mode"});
                    return;
                }
                queryBuilder.where("super_order.availableDispatch = :dispatch", {dispatch: dispatch});
            }

            let superOrders = await queryBuilder.getMany();
            res.send({superOrders: superOrders});

        } catch (error) {
            res.status(404).send({error: error.message});
            return;
        }

    };


    /*static editSuperOrder = async (req: Request, res: Response) => {
        let {storeURL, storeLocation, deadline, arrivalLocation, availableDispatch} = req.body;

        let id = req.params.id;

        const superOrderRepository = getRepository(SuperOrder);

        let superOrder: SuperOrder;

        try {
            superOrder = await superOrderRepository.findOneOrFail({id: id, isDeleted: false});
        } catch (error) {
            res.status(404).send({error: "Superorder not found"});
            return;
        }

        let user : User = res.locals.user;
        if(superOrder.userId != user.id){
            res.status(401).send();
            return;
        }

        superOrder.storeURL = storeURL;
        superOrder.storeLocation = storeLocation;
        superOrder.deadline = deadline;
        superOrder.arrivalLocation = arrivalLocation;
        superOrder.availableDispatch = availableDispatch;

        const errors = await validate(superOrder, { validationError: { target: false }});
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await superOrderRepository.save(superOrder);
        } catch (e) {
            res.status(409).send({error: "Couldn't save superOrder"});
            return;
        }

        res.status(200).send({superOrder: superOrder});
    };*/

}

function isDefined(str){
    return str != null && str != "";
}

export default SuperOrderController;

