import mongoose from 'mongoose';
import { tours } from '../interfaces';
import { getRequiredFromSchemas } from '../../utils';

const tourSchema = new mongoose.Schema<tours>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		unique: true,
	},
	rating: {
		type: Number,
		required: [true, 'Rating is required'],
		default: 5,
	},
	price: {
		type: Number,
		required: [true, 'Price is required'],
	},
});
export const Tours = mongoose.model('Tours', tourSchema);
export const tourRequired: string[] = getRequiredFromSchemas(tourSchema);
