import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToMany,
} from "typeorm";

import {Length, IsPhoneNumber, IsEmail} from "class-validator";
import * as bcrypt from "bcryptjs";
import {Order} from "./Order";
import {SuperOrder} from "./SuperOrder";

@Entity()
@Unique(["username", "mail"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 20)
    firstName: string;

    @Column()
    @Length(4, 20)
    lastName: string;

    @Column()
    @IsEmail()
    mail: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column()
    location: string;

    @Column()
    @IsPhoneNumber(null)
    phone: string;

    @OneToMany(type => Order, order => order.user)
    orders: Order[];

    @OneToMany(type => SuperOrder, superOrder => superOrder.user)
    superOrders: SuperOrder[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}