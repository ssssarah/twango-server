import {MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";
import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {getRepository } from "typeorm";
const faker = require('faker');

export class CreateFakeData1551364299079 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

	    const userRepository = getRepository(User);
        for(let i = 0; i < 50; ++i){
            let user : User = new User();
            user.username = faker.internet.userName();
            user.password = faker.internet.password();
            user.firstName = faker.name.firstName();
            user.lastName = faker.name.lastName();
            user.mail = faker.internet.email();
            user.phone = faker.phone.phoneNumber();
            user.location = faker.address.city();
            user.hashPassword();
            await userRepository.save(user);
		}


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        getRepository(User).clear();
    }

}