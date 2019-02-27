import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entity/User";
const faker = require('faker');

export class CreateUser implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {

    for(let i = 0; i < 50; ++i){
      let user = new User();
      user.username = faker.userName;
      user.password = faker.password;
      user.firstName = faker.firstName;
      user.lastName = faker.lastName;
      user.mail = faker.email;
      user.phone = faker.phoneNumber;
      user.location = faker.city;
      user.hashPassword();
      const userRepository = getRepository(User);
      await userRepository.save(user);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}