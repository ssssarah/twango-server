import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {OrderItem} from "../entity/OrderItem";
import {Order} from "../entity/Order";
import * as faker from "faker";
import {validate} from "class-validator";

export class CreateFakeOrderItem1551438023889 implements MigrationInterface {

    rand(min, max){
        return Math.floor(Math.random() * (+max - +min)) + +min;
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        let orderItemRepository = getRepository(OrderItem);
        let orders : Order[] = await getRepository(Order).find();
        for(let key in orders){
            let order = orders[key];
            console.log("orderItem for order " + order.id);

            for(let i = 0; i < 4; ++i){
                let orderItem = new OrderItem(); 
                orderItem.order = order;
                orderItem.quantity = this.rand(1, 10);
                orderItem.additionalInfo = "blah blah blah";
                orderItem.url = faker.internet.url();
                await orderItemRepository.save(orderItem);

                const errors = await validate(orderItem, { validationError: { target: false }});

                if (errors.length == 0) {
                    await orderItemRepository.save(orderItem);
                }

                else{
                    console.log(JSON.stringify(errors));
                }
            }
        }

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        getRepository(OrderItem).delete({});

    }

}
