import mongoose, { Schema } from 'mongoose';
import { ReviewInterface } from '../interfaces';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';

const reviewSchema = new mongoose.Schema<ReviewInterface>(
	{
		review: {
			type: String,
			required: [true, 'Review is required'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		createdAt: {
			type: Date,
			default: new Date(),
		},
		tour: {
			type: Schema.Types.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belongs to the tour'],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Review must belongs to the user'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//? Query Middleware
reviewSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any>, next) {
	this.populate({ path: 'tour', select: 'name -guides' }).populate({ path: 'user', select: 'name photo' });
	next();
});
export const Review = mongoose.model('Review', reviewSchema);
export const reviewRequired: string[] = getRequiredFromSchemas(reviewSchema);
export const reviewFields: string[] = getFieldsFromSchemas(reviewSchema);
