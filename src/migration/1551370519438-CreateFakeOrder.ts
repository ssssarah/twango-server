import {getRepository, In, MigrationInterface, Not, QueryRunner} from "typeorm";
import {Order, Status} from "../entity/Order";
import {Dispatch, SuperOrder} from "../entity/SuperOrder";
import {User} from "../entity/User";
import {validate} from "class-validator";

export class CreateFakeOrder1551370519438 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let orderRepository = getRepository(Order);
        let superOrderRepository = getRepository(SuperOrder);
        let userRepository = getRepository(User);

        let superOrders = await superOrderRepository.find({ relations: ["user"] });
        for(let key in superOrders){

            let superOrder : SuperOrder = superOrders[key];
            let previousIds = [superOrder.user.id];
            // any id that shouldn't be used for order (either an order from this userId is already made for this
            // superOrder, or the person initiating the superOrder has this id

            for(let i = 0; i < 5; ++i){
                let order : Order = new Order();

                order.superOrder = superOrder;
                order.dispatch = Math.random() > 0.5 ? Dispatch.DELIVERY : Dispatch.PICKUP;

                let status = Math.random();
                order.status =  status > 0.7 ? Status.ACCEPTED : (status > 0.3 ? Status.PENDING : Status.REFUSED);
                order.user = await userRepository.findOne({id: Not(In(previousIds))});

                previousIds.push(order.user.id);


                const errors = await validate(order, { validationError: { target: false }});

                if (errors.length == 0) {
                    await orderRepository.save(order);
                }
            }

        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        getRepository(Order).delete({});
    }

}
