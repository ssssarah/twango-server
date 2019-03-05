import {Request, Response, response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {SuperOrder} from "../entity/SuperOrder";

class SuperOrdersController {


    static search= async(req:Request, res: Response)=>{
        console.log(req.query);

        let terms=req.query.terms;
        let sort=req.query.sort;
        let tags=req.query.tags;
        let location=req.query.location;
        let nResults=req.query.nResults;
        let user=req.query.nResults;
        res.status(404).send("not found");
    }

}

export default SuperOrdersController;

