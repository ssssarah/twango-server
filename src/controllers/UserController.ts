import {Request, Response} from "express";
import {Column, getRepository} from "typeorm";
import {IsEmail, IsPhoneNumber, Length, validate} from "class-validator";

import {User} from "../entity/User";

class UserController {

    static listAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        const users = await userRepository.find({select: ["id", "username"]});
        res.send(users);
    };

    static getOneById = async (req: Request, res: Response) => {
        const id: number = req.params.id;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {select: ["id", "username"]});
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
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

    static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default UserController;