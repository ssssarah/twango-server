import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {

  static login = async (req: Request, res: Response) => {

    console.log("got a login request from " + req.body.username);
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
      return;
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(400).send({error: "No user with that username"});
      return;
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(400).send({error: "Invalid password"});
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.json({jwt: token});
  };

  static changePassword = async (req: Request, res: Response) => {

    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
      return;
    }

    let user = res.locals.user;
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({error: errors});
      return;
    }

    user.hashPassword();
    getRepository(User).save(user);
    res.status(200).send({success: "The password has been changed"});

  };


  static register = async (req: Request, res: Response) => {
    let {username, password, firstName, lastName, mail, location, phone, imageUrl} = req.body;
    let user = new User();
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.mail = mail;
    user.location = location;
    user.phone = phone;
    user.imageUrl = imageUrl;

    const errors = await validate(user, { validationError: { target: false }});
    if (errors.length > 0) {
      res.status(400).send({error: errors});
      return;
    }

    user.hashPassword();

    const userRepository = getRepository(User);

    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({error: e.message});
      return;
    }

    res.status(201).send({success: "Successful registration"});
  };
}
export default AuthController;