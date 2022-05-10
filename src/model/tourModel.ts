import mongoose, { Aggregate } from 'mongoose';
import slugify from 'slugify';
import { tours } from '../interfaces';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';

const tourSchema = new mongoose.Schema<tours>(
	{
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
		slug: String,
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
//virtuals create id fields automatically
tourSchema.virtual('durationInWeeks').get(function () {
	return this.duration && this.duration / 7;
});
//?Document Middleware
// save(), create() will run this
//it will run before saving the document to database
tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
//it will run after saving the document to database
// tourSchema.post('save', function (docs, next) {
// 	next();
// });

//? Query Middleware
tourSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any>, next) {
	this.find({ secretTour: { $ne: true } });
	next();
});
tourSchema.post('find', function (this: mongoose.Query<any, any, {}, any>, docs, next) {
	next();
});

//? Aggregation Middleware
tourSchema.pre('aggregate', function (this: Aggregate<any>, next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

export const Tours = mongoose.model('Tours', tourSchema);
export const tourRequired: string[] = getRequiredFromSchemas(tourSchema);
export const tourFields: string[] = getFieldsFromSchemas(tourSchema);
