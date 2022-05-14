import { NextFunction, Request, RequestHandler, Response } from 'express';
export const bodyValidator =
	(required: boolean, validators: string[]): RequestHandler =>
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
