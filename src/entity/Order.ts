import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId} from 'typeorm';
import {IsBoolean, IsEnum, IsIn, IsNotEmpty} from 'class-validator';
import { Dispatch, SuperOrder } from './SuperOrder';
import { User } from './User';
import { OrderItem } from './OrderItem';

export enum Status {
	ACCEPTED = "ACCEPTED",
	PENDING = "PENDING",
	REFUSED = "REFUSED",
}

@Entity('orderr')
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

	@RelationId((order: Order) => order.user)
	userId: number;

	@IsNotEmpty()
	@IsEnum(Dispatch)
	@Column()
	@IsIn([Dispatch.DELIVERY, Dispatch.PICKUP])
	dispatch: Dispatch;

	@IsNotEmpty()
	@IsEnum(Status)
	@Column()
	status: Status;

	@OneToMany(type => OrderItem, orderItem => orderItem.order, {cascade: ["insert", "update"]})
	orderItems: OrderItem[];

	@IsBoolean()
	@Column({default: false})
	isDeleted: boolean;
}
