import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {SuperOrder} from "../entity/SuperOrder";
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
            res.status(404).send("Superorder not found");
        }
    };

    static newSuperOrder = async (req: Request, res: Response) => {

        const user: User = res.locals.user;

        if(user == null){
            res.status(401).send("Must be logged in");
            return;
        }

        let {storeURL, storeLocation, deadline, storeName, arrivalLocation, availableDispatch, tags} = req.body;

        let superOrder = new SuperOrder();
        superOrder.user = user;
        superOrder.storeURL = storeURL;
        superOrder.storeLocation = storeLocation;
        superOrder.deadline = deadline;
        superOrder.storeName = storeName;
        superOrder.arrivalLocation = arrivalLocation;
        superOrder.availableDispatch = availableDispatch;
        superOrder.tags = tags;

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

    //TODO
    static search = async (req: Request, res: Response) => {
        console.log(req.query);
        let terms = req.query.terms;
        let sort = req.query.sort;
        let tags = req.query.tags;
        let location = req.query.location;
        let nResults = req.query.nResults;
        let user = req.query.nResults;
        res.status(404).send("not found");
    };

}

export default SuperOrderController;

