import { Types } from 'mongoose';
export interface tours {
	name: string;
	ratingsAverage: number;
	price: number;
	duration: number;
	maxGroupSize: number;
	difficulty: string;
	ratingsQuantity: number;
	priceDiscount: number;
	summary: string;
	description: string;
	imageCover: string;
	images: string[];
	createdAt: Date;
	startDates: Date[];
	_id: Types.ObjectId;
}
