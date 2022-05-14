import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { API } from '../enums';
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
		const secret = process.env.JWT_SECRET || 'there_is_no_secret';
		//generating token
		const token = jwt.sign({ id: newUser._id }, secret, {
			expiresIn: process.env.JWT_EXPIRATION,
		});
		res.status(201).jsend.success({ token, result: newUser });
	}

	@post('/login')
	@error(catchAsync)
	@use(bodyValidator(true, ['email', 'password']))
	async login(req: Request, res: Response, next: NextFunction) {
		res.status(200).jsend.success('');
	}
}
