import { Request, Response } from 'express';
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
		res.status(201).jsend.success({ result: newUser });
	}
}
