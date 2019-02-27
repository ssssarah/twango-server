import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {IsNotEmpty, IsInt} from "class-validator";
import {Order} from "./Order";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Order, order => order.orderItems)
    @IsNotEmpty()
    @JoinColumn()
    order: Order;

    @Column()
    additionalInfo: string;

    @IsNotEmpty()
    @IsInt()
    @Column()
    quantity: number;

}