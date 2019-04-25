import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToMany,
} from "typeorm";

import {Length, IsPhoneNumber, IsEmail, IsUrl, IsOptional, IsNotEmpty} from "class-validator";
import * as bcrypt from "bcryptjs";
import {Order} from "./Order";
import {SuperOrder} from "./SuperOrder";

@Entity()
//@Unique(["username", "mail"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    @Length(4, 20)
    @IsNotEmpty()
    username: string;

    @Column()
    @Length(4, 20)
    @IsNotEmpty()
    firstName: string;

    @Column()
    @Length(4, 20)
    @IsNotEmpty()
    lastName: string;

    @Column({unique: true})
    @IsNotEmpty()
        //@IsEmail() TODO maybe fix, doesn't seem to work
    mail: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 100)
    password: string;

    @Column()
    @IsNotEmpty()
    location: string;

    @Column()
    @IsNotEmpty()
    // @IsPhoneNumber(null) needs country code to work 
    phone: string;

    @OneToMany(type => Order, order => order.user)
    orders: Order[];

    @OneToMany(type => SuperOrder, superOrder => superOrder.user)
    superOrders: SuperOrder[];

    @Column({nullable: true})
    @IsUrl()
    @IsOptional()
    imageUrl: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}