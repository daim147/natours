import { NextFunction, Request, RequestHandler, Response } from 'express';

export const bodyValidator =
	(...validators: string[]): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		if (!req.body) {
			res.status(422).send('Invalid request');
			return;
		}
		for (let key of validators) {
			if (!req.body[key]) {
				res.status(422).send('Invalid request ' + key + ' should be present');
				return;
			}
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

export const sampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
	console.log('From Controller middleware');
	next();
};

export const sampleParamsMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
	params: any
) => {
	console.log('HERES COME THE PARAMS MIDDLEWARE', params);
	next();
};
