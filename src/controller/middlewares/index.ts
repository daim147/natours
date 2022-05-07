import v8 from 'v8';
import { NextFunction, Request, RequestHandler, Response } from 'express';

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

export const removePropertiesFromQuery =
	(...removeProperties: string[]): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		const queryDuplicates = v8.deserialize(v8.serialize(req.query));
		removeProperties.forEach((property) => {
			delete queryDuplicates[property];
		});
		req.filterQuery = queryDuplicates;
		next();
	};

export const queryValidator =
	(...queryNameArray: string[]): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		for (let key in req.filterQuery || req.query) {
			if (!queryNameArray.includes(key)) {
				res.status(422).send(`Invalid query params ${key}`);
				return;
			}
		}
		const query = req.filterQuery ? 'filterQuery' : 'query';
		//replacing gte, gt,lte,lt with $operator, in req.filterQuery or req.query
		req[query] = JSON.parse(JSON.stringify(req[query]).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));
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
