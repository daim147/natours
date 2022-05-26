import { Model, Types } from 'mongoose';
export interface ReviewInterface {
	review: string;
	rating: number;
	createdAt: Date;
	tour: Types.ObjectId;
	user: Types.ObjectId;
}

export interface ReviewModel extends Model<ReviewInterface> {
	calcRatingAvgAndReviewCount(id: Types.ObjectId): Promise<any>;
}
