import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne,} from "typeorm";
import {IsUrl, IsNotEmpty, IsDate, IsEnum} from "class-validator";
import {User} from "./User";
import {Order} from "./Order";

export enum Dispatch {
    PICKUP, DELIVERY, BOTH
}

@Entity()
export class SuperOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @JoinColumn()
    @ManyToOne(type => User, user => user.superOrders)
    user : User;

    @IsNotEmpty()
    @IsUrl()
    @Column()
    storeURL: string;

    @IsNotEmpty()
    @Column()
    storeLocation: string;

    @IsNotEmpty()
    @IsDate()
    @Column()
    deadline: Date;

    @IsNotEmpty()
    @Column()
    arrivalLocation: string;

    @IsNotEmpty()
    @IsEnum(Dispatch)
    @Column()
    availableDispatch: Dispatch;

    @Column()
    storeName: string;

    @Column("simple-array")
    tags: string[];

    @OneToMany(type => Order, order => order.superOrder)
    orders: Order[];
}

