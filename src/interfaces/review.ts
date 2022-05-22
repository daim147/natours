import { Types } from 'mongoose';
export interface ReviewInterface {
	review: string;
	rating: number;
	createdAt: Date;
	tour: Types.ObjectId;
	user: Types.ObjectId;
}
