import type { Model, Types } from 'mongoose';

export interface BookingInterface {
	tour: Types.ObjectId;
	price: number;
	createdAt: Date;
	paid: boolean;
	user: Types.ObjectId;
}
export type BookingModel = Model<BookingInterface, {}, {}>;
