import type { JwtPayload } from 'jsonwebtoken';

import { CustomError } from '../../interfaces';
import { catchAsync } from './errorMiddlewares';
import { secret, verifyToken } from '../../utils';
import { User } from '../../model/userModel';

export const jwtVerification = catchAsync(async (req, res, next) => {
	//1)Getting Token and check if it is there
	let token: string | undefined;
	if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')) {
		token = req.headers['authorization'].split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(new CustomError('You are not logged in to get access', 401));
	}
	//2) Verification of token
	const decode = await verifyToken<JwtPayload>(token, secret);
	//3) Check if user still exists
	const user = await User.findById(decode.id);
	if (!user) {
		return next(new CustomError('User belongs to this token has expired', 401));
	}
	//4) Check if user changePasswordAfter the token has issued
	if (user?.changePasswordAfter(decode.iat!)) {
		return next(new CustomError('Please Login again!. User has changed the password', 401));
	}
	res.locals.user = user;
	req.user = user;
	next();
});
