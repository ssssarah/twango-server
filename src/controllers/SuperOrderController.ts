import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {SuperOrder} from "../entity/SuperOrder";

class SuperOrderController {

    static getOneById = async (req: Request, res: Response) => {
        const id: number = req.params.id;
        const superOrderRepository = getRepository(SuperOrder);
        try {
            const superOrder = await superOrderRepository.findOneOrFail(id, {select: ["id"]});
            res.send(superOrder);
        } catch (error) {
            res.status(404).send("Superorder not found");
        }
    };

    static newSuperOrder = async (req: Request, res: Response) => {
        let { user, storeURL, storeLocation,deadline,arrivalLocation,availableDispatch} = req.body;

        let superOrder=new SuperOrder();
        superOrder.user=user;
        superOrder.storeURL=storeURL;
        superOrder.storeLocation=storeLocation;
        superOrder.deadline=deadline;
        superOrder.availableDispatch=availableDispatch;

        const superOrderRepository = getRepository(SuperOrder);

        const errors = await validate(superOrder);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        try{
            await superOrderRepository.save(superOrder);
        }
        catch (e) {
            res.status(409).send("couldn't create superorder");
            return;
        }
        res.status(201).send("Superorder created");
    };

    static editSuperOrder = async (req: Request, res: Response) => {
        let { user, storeURL, storeLocation,deadline,arrivalLocation,availableDispatch} = req.body;

        let id=req.params.id;

        const superOrderRepository=getRepository(SuperOrder);
        let superOrder:SuperOrder;
        try {
            superOrder = await superOrderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Superorder not found");
            return;
        }

        superOrder.user=user;
        superOrder.storeURL=storeURL;
        superOrder.storeLocation=storeLocation;
        superOrder.deadline=deadline;
        superOrder.availableDispatch=availableDispatch;

        const errors = await validate(superOrder);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await superOrderRepository.save(superOrder);
        } catch (e) {
            res.status(409).send("Couldn't save superorder");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    static deleteSuperOrder = async (req: Request, res: Response) => {
        const id = req.params.id;

        const superOrderRepository = getRepository(SuperOrder);
        let superOrder:SuperOrder;
        try {
            superOrder = await superOrderRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        superOrderRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default SuperOrderController;

