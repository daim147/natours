import type { NextFunction, Request, RequestHandler, Response } from 'express';

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
