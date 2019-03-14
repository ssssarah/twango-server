import {MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";
import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {getRepository } from "typeorm";
import { getMaxListeners } from "cluster";
const faker = require('faker');
import {getConnection} from "typeorm";

export class CreateTestUser1551822234549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User);
    let user : User = new User();
    user.username = "admin";
    user.password = "admin";
    user.firstName = "Micheal";
    user.lastName = "Jackson";
    user.mail = "mj@gmail.com";
    user.phone = faker.phone.phoneNumber();
    user.location = faker.address.city();
    user.hashPassword();
    await userRepository.save(user);
        }

    public async down(queryRunner: QueryRunner): Promise<any> {

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("username = :admin", { username: "admin" })
        .execute();
    }

}
