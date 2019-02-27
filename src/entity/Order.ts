import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsEnum, IsIn, IsNotEmpty} from "class-validator";
import {Dispatch, SuperOrder} from "./SuperOrder";
import {User} from "./User";
import {OrderItem} from "./OrderItem";

enum Status {
    ACCEPTED, PENDING, REFUSED
}

@Entity("orderr")
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @JoinColumn()
    @ManyToOne(type => SuperOrder, superOrder => superOrder.orders)
    superOrder: SuperOrder;

    @IsNotEmpty()
    @JoinColumn()
    @ManyToOne(type => User, user => user.orders)
    user: User;

    @IsNotEmpty()
    @IsEnum(Dispatch)
    @Column()
    @IsIn([Dispatch.DELIVERY, Dispatch.PICKUP])
    dispatch: Dispatch;

    @IsNotEmpty()
    @IsEnum(Status)
    @Column()
    status: Status;

    @OneToMany(type => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
}

