import { type Aggregate, Schema, type Query, model } from 'mongoose';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../utils';

const bookingSchema = new Schema(
	{
		tour: {
			type: Schema.Types.ObjectId,
			ref: 'Tour',
			required: [true, 'Booking must belong to a Tour!'],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Booking must belong to a User!'],
		},
		price: {
			type: Number,
			required: [true, 'Booking must have a price.'],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		paid: {
			type: Boolean,
			default: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

bookingSchema.pre(/^find/, function (next) {
	this.populate('user').populate('tour');
	next();
});

export const Booking = model('Booking', bookingSchema);
export const bookingRequired: string[] = getRequiredFromSchemas(bookingSchema);
export const bookingFields: string[] = getFieldsFromSchemas(bookingSchema);
