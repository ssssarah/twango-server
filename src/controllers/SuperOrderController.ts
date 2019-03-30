import {Request, Response} from "express";
import {Brackets, getRepository, SelectQueryBuilder} from "typeorm";
import {validate} from "class-validator";

import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {User} from "../entity/User";
import {Order} from "../entity/Order";

class SuperOrderController {

    static getSuperOrder = async (req: Request, res: Response) => {

        const id: number = req.params.id;
        const superOrderRepository = getRepository(SuperOrder);
        try {
            const superOrder = await superOrderRepository.findOneOrFail(id);
            let response = {superOrder: superOrder};

            const user: User = res.locals.user;

            //if logged in, potentially add to response some info
            if(user != null){
                let orderRepository = getRepository(Order);
                //if superOrder is mine, get all orders
                if(user.id == superOrder.userId){
                    let orders = await orderRepository.find({superOrder: superOrder});
                    if(orders != null){
                        response["orders"] = orders;
                    }
                }
                //look into the superOrder's orders if one is mine
                else{
                    let order = await orderRepository.findOne({superOrder: superOrder, user: user});
                    if(order != null){
                        response["myOrder"] = order;
                    }
                }
            }
            res.send(response);

        } catch (error) {
            res.status(404).send({error:"SuperOrder not found"});
        }
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

    //TODO
    static editSuperOrder = async (req: Request, res: Response) => {
        let {storeURL, storeLocation, deadline, arrivalLocation, availableDispatch} = req.body;

        let id = req.params.id;

        const superOrderRepository = getRepository(SuperOrder);

        let superOrder: SuperOrder;

        try {
            superOrder = await superOrderRepository.findOneOrFail(id);
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
    };

    //TODO
    static deleteSuperOrder = async (req: Request, res: Response) => {
        const id = req.params.id;

        const superOrderRepository = getRepository(SuperOrder);
        let superOrder: SuperOrder;

        try {
            superOrder = await superOrderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({error: "SuperOrder not found"});
            return;
        }

        let user : User = res.locals.user;
        if(superOrder.userId != user.id){
            res.status(401).send();
            return;
        }

        superOrderRepository.delete(id);
        res.status(200).send({success: "SuperOrder deleted"});
    };

    //TODO test it
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

            // {type: "deadline", order:"ASC/DESC"}
            if(sortType != null && sortOrder != null){ //TODO check if empty and not specified in url is the same

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

            if(tags != null){

                queryBuilder.andWhere(new Brackets(sqb => {

                    /*
                        TODO tags= when array of one is passed, tags=___&tags=___ when array of multiple
                        array of one ends up looking like just a variable so we shouldn't loop through it
                        check type before?
                    */
                    for(let key in tags){
                        let tag = '%' + tags[key]/*.toLowerCase()*/  + '%';
                        //TODO case sensitive????? lowercase at creation & querying?
                        sqb.orWhere("super_order.tags like :tag", { tag: tag });
                        sqb.orWhere("super_order.storeName like :tag", { tag: tag });
                        console.log(tag);
                        //TODO this querying only takes the last tag into account, although it loops through all, logic issue
                    }

                }));

            }

            if(dispatch != null){
                if(dispatch != Dispatch.DELIVERY && dispatch != Dispatch.PICKUP){
                    res.status(404).send({error: "Invalid dispatch mode"});
                    return;
                }
                queryBuilder.where("super_order.availableDispatch = :dispatch", {dispatch: dispatch});
            }

            let superOrders: SuperOrder[] = await queryBuilder.getMany();
            res.send({superOrders: superOrders});

        } catch (error) {
            res.status(404).send({error: error.message});
            return;
        }

    };

}

export default SuperOrderController;

