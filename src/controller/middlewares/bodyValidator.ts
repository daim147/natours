import { NextFunction, Request, RequestHandler, Response } from 'express';

import { CustomError } from '../../interfaces';
export const bodyValidator =
	(
		validators: { required: boolean; values: string[] },
		removeProperty: { required: boolean; values: string[] } = { required: true, values: ['role'] }
	): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		if (!req.body) {
			res.status(422).send('Invalid request');
			return;
		}
		if (validators.required) {
			for (let key of validators.values) {
				if (!req.body[key]) {
					next(new CustomError('Invalid request ' + key + ' should be present', 400));
					return;
				}
			}
		} else {
			Object.keys(req.body).forEach((key) => {
				if (!validators.values.includes(key)) {
					next(new CustomError('Invalid request ' + key + ' should not be present', 400));
					return;
				}
			});
		}
		removeProperty.values.forEach((key) => {
			if (removeProperty.required) {
				if (key in req.body) {
					return next(new CustomError('Invalid request ' + key + ' should not be present', 401));
				}
			}
			req.hiddenBody = {};
			req.hiddenBody[key] = req.body[key];

			delete req.body[key];
		});
		next();
	};
