import {Request, Response} from "express";
import {Column, getRepository} from "typeorm";
import {IsEmail, IsPhoneNumber, Length, validate} from "class-validator";

import {User} from "../entity/User";

class UserController {

    static getOneById = async (req: Request, res: Response) => {
        const id: number = req.params.id;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id,
            {select: ["id", "username", "firstName", "lastName", "imageUrl"]}
            );
            res.status(200).send(user);
        } catch (error) {
            res.status(404).send({error: "User not found"});
        }
    };

    static getProfile = async (req: Request, res: Response) => {
        const user: User = res.locals.user;
        delete user.password;
        res.status(200).send({profile: user});
    };

    static editUser = async (req: Request, res: Response) => {
        const user: User = res.locals.user;
        const {username, firstName, lastName, mail, location, phone, imageUrl} = req.body;

        user.username = username || user.username;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.mail = mail || user.mail;
        user.location = location || user.location;
        user.phone = phone || user.phone;
        user.imageUrl = imageUrl || user.imageUrl;

        console.log("image url is " + imageUrl);

        const errors = await validate(user, { validationError: { target: false }});

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await getRepository(User).save(user);
        } catch (e) {
            res.status(409).send({error: e.message});
            return;
        }

        delete user.password;
        res.status(200).send({profile: user});
    };

}

export default UserController;