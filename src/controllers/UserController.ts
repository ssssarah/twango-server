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
        const id = req.params.id;
        const {username, firstName, lastName, mail, location, phone} = req.body; //todo send everything or only modified fields?

        const userRepository = getRepository(User);

        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.mail = mail;
        user.location = location;
        user.phone = phone;

        const errors = await validate(user);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

}

export default UserController;