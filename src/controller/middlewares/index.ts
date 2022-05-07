import { NextFunction, Request, RequestHandler, Response } from 'express';
import { handleNonFilterProperty } from '../../../utils';
export const bodyValidator =
	(required: boolean, ...validators: string[]): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		if (!req.body) {
			res.status(422).send('Invalid request');
			return;
		}
		if (required) {
			for (let key of validators) {
				if (!req.body[key]) {
					res.status(422).send('Invalid request ' + key + ' should be present');
					return;
				}
			}
		} else {
			Object.keys(req.body).forEach((key) => {
				if (!validators.includes(key)) {
					res.status(422).send('Invalid request ' + key + ' should not be present');
				}
			});
		}
		next();
	};

export const paramsValidator =
	(...validators: string[]): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		if (!req.params) {
			res.status(422).send('Invalid Param');
			return;
		}
		for (let key of validators) {
			if (!req.params[key]) {
				res.status(422).send('Invalid Params ' + key + ' should be present');
				return;
			}
		}
		next();
	};

export const queryValidator =
	(filterProperties: string[] = [], nonFilterProperties: string[] = []): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		//here I separated nonFilterQueries based on  properties provided from req.query and delete it from req.query
		if (nonFilterProperties.length) {
			req.nonFilterQuery = {};
			nonFilterProperties.forEach((property) => {
				if (Object.keys(req.query).includes(property)) {
					console.log(req.query[property]);
					console.log(typeof req.query[property]);
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
export const sampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// console.log('From Controller middleware');
	next();
};

export const sampleParamsMiddleware = (req: Request, res: Response, next: NextFunction, params: any) => {
	// console.log('HERES COME THE PARAMS MIDDLEWARE', params);
	next();
};
