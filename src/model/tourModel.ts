import mongoose from 'mongoose';
import { tours } from '../interfaces';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';

const tourSchema = new mongoose.Schema<tours>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		unique: true,
		trim: true,
	},
	ratingsAverage: {
		type: Number,
		default: 5,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	duration: {
		type: Number,
		required: [true, 'Rating is required'],
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'Rating is required'],
	},
	difficulty: {
		type: String,
		required: [true, 'Rating is required'],
	},
	price: {
		type: Number,
		required: [true, 'Price is required'],
	},
	priceDiscount: Number,
	summary: {
		type: String,
		trim: true,
		required: [true, 'Summary is required'],
	},
	description: {
		type: String,
		trim: true,
	},
	imageCover: {
		type: String,
		trim: true,
		required: [true, 'Image cover is required'],
	},
	images: [String],
	createdAt: {
		type: Date,
		default: new Date(),
	},
	startDates: [Date],
});
export const Tours = mongoose.model('Tours', tourSchema);
export const tourRequired: string[] = getRequiredFromSchemas(tourSchema);
export const tourFields: string[] = getFieldsFromSchemas(tourSchema);
