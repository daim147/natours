import type { Model, Types } from 'mongoose';
export interface Location {
	type: 'Point';
	coordinates: [number, number];
	address: string;
	description: string;
	day?: number;
}
export interface TourInterface {
	name: string;
	ratingsAverage: number;
	price: number;
	duration: number;
	maxGroupSize: number;
	difficulty: string;
	ratingsQuantity: number;
	priceDiscount?: number;
	summary: string;
	description?: string;
	imageCover: string;
	images?: Types.Array<string>;
	createdAt: Date;
	startDates?: Types.Array<Date>;
	_id: Types.ObjectId;
	slug: string;
	secretTour: boolean;
	startLocation: Types.Subdocument<Location>;
	locations: Types.DocumentArray<Location>;
	guides: Types.Array<Types.ObjectId>;
}
export type TourModel = Model<TourInterface, {}, {}>;
