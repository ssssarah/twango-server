import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {User} from "../entity/User";
const faker = require('faker');

export class CreateFakeSuperOrder1551370337581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepository = getRepository(User);
        let allUsers = await userRepository.find();
        const superOrderRepository = getRepository(SuperOrder);

        for(let key in allUsers){
            let user = allUsers[key];
            let nb = user.username === "test" ? 10 : 1;

            for(let i = 0; i < nb; ++i){

                let superOrder : SuperOrder = new SuperOrder();
                superOrder.user = user;
                superOrder.storeURL = faker.internet.url();
                superOrder.storeLocation = faker.address.city();
                superOrder.storeName = faker.internet.domainName();
                superOrder.imageUrl = faker.image.imageUrl(300,300);

                let randomDispatch = Math.random();
                superOrder.availableDispatch = randomDispatch > 0.7 ? Dispatch.PICKUP :
                    (randomDispatch > 0.3 ? Dispatch.DELIVERY : Dispatch.BOTH);

                superOrder.deadline = faker.date.future();
                superOrder.arrivalLocation = faker.address.city();
                superOrder.tags = faker.random.words(5).split(" ");
                await superOrderRepository.save(superOrder);
            }

        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        getRepository(SuperOrder).delete({});
    }



}




