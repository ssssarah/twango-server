import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
    RelationId,
    CreateDateColumn,
} from "typeorm";
import {IsUrl, IsNotEmpty, IsDate, IsEnum, IsDateString, IsArray, IsBoolean, IsOptional} from "class-validator";
import {User} from "./User";
import {Order} from "./Order";

export enum Dispatch {
    PICKUP = "PICKUP",
    DELIVERY = "DELIVERY",
    BOTH = "BOTH"
}

@Entity()

export class SuperOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(type => User, user => user.superOrders, {nullable:false})
    user : User;

    @RelationId((superOrder: SuperOrder) => superOrder.user)
    userId: number;


    @Column({nullable: true})
    @IsUrl()
    @IsOptional()
    imageUrl: string;

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
    @IsNotEmpty()
    storeName: string;

    @Column({type:"simple-json", nullable: true})
    @IsArray()
    tags: string[];

    @OneToMany(type => Order, order => order.superOrder)
    orders: Order[];

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @IsBoolean()
    @Column({default: false})
    isDeleted: boolean;

}

