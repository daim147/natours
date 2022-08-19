import type { JwtPayload } from 'jsonwebtoken';

import { CustomError } from '../../interfaces';
import { secret, verifyToken } from '../../utils';
import { User } from '../../model/userModel';
import { NextFunction, Request, Response } from 'express';

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
	if (req.cookies.jwt) {
		try {
			const decode = await verifyToken<JwtPayload>(req.cookies.jwt, secret);
			//3) Check if user still exists
			const user = await User.findById(decode.id);
			if (!user) {
				return next(new CustomError('User belongs to this token has expired', 401));
			}
			//4) Check if user changePasswordAfter the token has issued
			if (user?.changePasswordAfter(decode.iat!)) {
				return next(new CustomError('Please Login again!. User has changed the password', 401));
			}
			//GRANT ACCESS TO PROTECTED ROUTE
			res.locals.user = user;
			return next();
		} catch (error) {
			return next();
		}
	}

	//2) Verification of token

	next();
};
