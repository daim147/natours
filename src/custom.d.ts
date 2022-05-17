import { Query } from 'express-serve-static-core';
import { UserInterface } from './interfaces';
declare global {
	namespace Express {
		interface Request {
			filterQuery: Query;
			nonFilterQuery: Query;
			hiddenBody: { [key: string]: any };
			user: UserInterface;
		}
	}
}
