import { NextFunction, Request, RequestHandler, Response } from 'express';
import { handleNonFilterProperty } from '../../../utils';
export const urlSearchParamsValidator =
	(
		filterProperties: string[] = [],
		nonFilterProperties: string[] = ['sort', 'limit', 'select', 'page']
	): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		//here I separated nonFilterQueries based on  properties provided from req.query and delete it from req.query
		if (nonFilterProperties.length) {
			req.nonFilterQuery = {};
			Object.keys(req.query).forEach((property) => {
				if (nonFilterProperties.includes(property)) {
					req.query[property] = handleNonFilterProperty(req.query[property]);
					req.nonFilterQuery[property] = req.query[property];
					delete req.query[property];
				}
			});
		}
		//here I separated filterQueries based on  properties(of schemas) provided from req.query and delete it from req.query
		if (filterProperties.length) {
			req.filterQuery = {};
			for (let key in req.query) {
				if (filterProperties.includes(key)) {
					req.filterQuery[key] = req.query[key];
					delete req.query[key];
				}
			}
			//replace operators(gte, gt, lte,lt) with $operators
			req.filterQuery = JSON.parse(
				JSON.stringify(req.filterQuery).replace(/\b(gte|gt|lte|lt)\b/g, (match: any) => `$${match}`)
			);
		}
		next();
	};
