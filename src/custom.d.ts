import { Query } from 'express-serve-static-core';
import { UserInterface } from './interfaces';

declare global {
	namespace Express {
		interface Request {
			filterQuery: FilterQuery<Query>;
			nonFilterQuery: Query;
			hiddenBody: { [key: string]: any };
			user: UserInterface;
			requestTime: string;
		}
	}
}
