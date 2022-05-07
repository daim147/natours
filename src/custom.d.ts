import { Query } from 'express-serve-static-core';
declare global {
	namespace Express {
		interface Request {
			filterQuery: Query;
			nonFilterQuery: Query;
		}
	}
}
