import { NextFunction, Request, Response } from 'express';
import { signToken } from '../../utils';

import { API } from '../enums';
import { CustomError } from '../interfaces';
import { User, userRequired } from '../model/userModel';
import { controller, error, post, use } from './decorators';
import { bodyValidator, catchAsync } from './middlewares';

@controller(`${API.start}auth`)
class AuthController {
	@post('/signup')
	@use(bodyValidator(true, userRequired))
	@error(catchAsync)
	async signup(req: Request, res: Response) {
		const newUser = await User.create(req.body);
		//generating token
		const token = signToken(newUser._id);
		res.status(201).jsend.success({ token, result: newUser });
	}

	@post('/login')
	@error(catchAsync)
	@use(bodyValidator(true, ['email', 'password']))
	async login(req: Request, res: Response, next: NextFunction) {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');
		//check if user exists and also given password match the hashPassword store in db
		if (!user || !(await user?.correctPassword(password, user.password))) {
			return next(new CustomError('Invalid email or password', 401));
		}
		const token = signToken(user._id);
		res.status(200).jsend.success({ token });
	}
}
