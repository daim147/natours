import mongoose, { Schema } from 'mongoose';
import { ReviewInterface, ReviewModel } from '../interfaces';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';
import { Tour } from './tourModel';

const reviewSchema = new mongoose.Schema<ReviewInterface, ReviewModel>({
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
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
//? Query Middleware
reviewSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any>, next) {
	// this.populate({ path: 'tour', select: 'name -guides' }).populate({ path: 'user', select: 'name photo' });
	this.populate({ path: 'user', select: 'name photo' });
	next();
});
reviewSchema.static('calcRatingAvgAndReviewCount', async function (tourId) {
	const [result] = await this.aggregate([
		{ $match: { tour: tourId } },
		{ $group: { _id: '$tour', ratingsAverage: { $avg: '$rating' }, ratingsQuantity: { $sum: 1 } } },
	]);
	if (!result) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsAverage: 4.5,
			ratingsQuantity: 0,
		});
		return;
	}
	const { ratingsAverage, ratingsQuantity } = result;
	await Tour.findByIdAndUpdate(tourId, {
		ratingsAverage,
		ratingsQuantity,
	});
});

reviewSchema.post('save', async function () {
	//@ts-ignore
	this.constructor.calcRatingAvgAndReviewCount(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (this: mongoose.Query<any, any, {}, any>) {
	//@ts-ignore
	this.review = await this.model.findOne(this.getQuery());
});
reviewSchema.post(/^findOneAnd/, async function (this: mongoose.Query<any, any, {}, any>) {
	//@ts-ignore
	this.review.constructor.calcRatingAvgAndReviewCount(this.review.tour);
});
export const Review = mongoose.model<ReviewInterface, ReviewModel>('Review', reviewSchema);
Review.calcRatingAvgAndReviewCount;
export const reviewRequired: string[] = getRequiredFromSchemas(reviewSchema);
export const reviewFields: string[] = getFieldsFromSchemas(reviewSchema);
