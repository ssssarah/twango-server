import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import {getRepository} from "typeorm";
import {User} from "../entity/User";

export const checkJwtOptional = async (req: Request, res: Response, next: NextFunction) => {
    return checkJwt(true, req, res, next);
};

export const checkJwtMandatory = async (req: Request, res: Response, next: NextFunction) => {
    return checkJwt(false, req, res, next);
};

const checkJwt = async (optional: boolean, req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header("Authorization");
        if (token == null && optional) {
            if(token == null){
                console.log("Header is null");
            }

            next();
            return;
        }

        let jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        const {userId, username} = jwtPayload;
        let user = await getRepository(User).findOne(userId);
        if(user == null){
            console.log("can't find by user id");
        }
        res.locals.user = user;

        const newToken = jwt.sign({userId, username}, config.jwtSecret, {
            expiresIn: "1h"
        });

        res.setHeader("token", newToken);
        next();

    } catch (error) {
        console.log("fail");
        res.status(401).send();
        return;
    }

};