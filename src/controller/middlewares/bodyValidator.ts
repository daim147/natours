import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../../interfaces';
export const bodyValidator =
	(required: boolean, validators: string[], removeProperty: string[] = ['admin']): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		if (!req.body) {
			res.status(422).send('Invalid request');
			return;
		}
		if (required) {
			for (let key of validators) {
				if (!req.body[key]) {
					next(new CustomError('Invalid request ' + key + ' should be present', 400));
					return;
				}
			}
		} else {
			Object.keys(req.body).forEach((key) => {
				if (!validators.includes(key)) {
					next(new CustomError('Invalid request ' + key + ' should not be present', 400));
					return;
				}
			});
		}
		removeProperty.forEach((key) => {
			req.hiddenBody = {};
			req.hiddenBody[key] = req.body[key];
			delete req.body[key];
		});
		next();
	};
