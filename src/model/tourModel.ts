import mongoose, { Aggregate, Schema } from 'mongoose';
import slugify from 'slugify';
import { Location, TourInterface, TourModel } from '../interfaces';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';
const locationSchema = new Schema<Location>({
	type: {
		type: String,
		enum: ['Point'],
		default: 'Point',
	},
	coordinates: [Number],
	address: String,
	description: String,
	day: Number,
});
const tourSchema = new mongoose.Schema<TourInterface, TourModel>(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: true,
			trim: true,
			maxlength: [40, '{VALUE} is InValid. Tour name must be at less than or equal to 40 characters'],
			minlength: [10, '{VALUE} is InValid. Tour name must be at least 10 characters'],
			// validate: [validator.isAlpha, '{PATH} should always be Alpha(a-z/A-Z) but got {VALUE} '],
		},
		ratingsAverage: {
			type: Number,
			default: 5,
			min: [1, '{VALUE} is InValid. Rating average should be above 1'],
			max: [5, '{VALUE} is InValid. Rating average should be below 5'],
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
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: '{VALUE} is not supported Difficulty should be one of easy, medium, difficult',
			},
		},
		price: {
			type: Number,
			required: [true, 'Price is required'],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (this: TourInterface, value: number): boolean {
					return value < this.price;
				},
				message: function (props) {
					return `${props.path} should be less than price`;
				},
			},
		},
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
		images: {
			type: [String],
		},
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
		startLocation: locationSchema,
		locations: [locationSchema],
		guides: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
//? Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
//virtuals create id fields automatically
tourSchema.virtual('durationInWeeks').get(function () {
	return this.duration && this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'tour',
	localField: '_id',
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
	this.find({ secretTour: { $ne: true } }).populate({ path: 'guides', select: '-__v -passwordChangeAt' });
	next();
});
// tourSchema.post(/^find/, function (this: mongoose.Query<any, any, {}, any>, docs, next) {
// 	// console.log(docs);
// 	next();
// });

//? Aggregation Middleware
tourSchema.pre('aggregate', function (this: Aggregate<any>, next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

export const Tour = mongoose.model('Tour', tourSchema);
export const tourRequired: string[] = getRequiredFromSchemas(tourSchema);
export const tourFields: string[] = getFieldsFromSchemas(tourSchema);
