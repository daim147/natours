import { NextFunction, Request, Response } from 'express';

import { CustomError, UserRole } from '../../interfaces';

export const restrictTo =
	(...roles: UserRole) =>
	(req: Request, res: Response, next: NextFunction) => {
		const role = req.user.role;
		if (!roles.find((rl) => rl === role)) {
			return next(new CustomError('You are not allowed to access this route as ' + role, 401));
		}
		next();
	};
