import { NextFunction, Request, Response } from 'express';

import { API } from '../enums';
import { User, userFields } from '../model/userModel';
import { controller, createRouterMiddlewareBefore, del, error, get, patch, use } from './decorators';
import { deleteOne, getAll, getOne, updateOne } from './crudDelegators';
import { bodyValidator, catchAsync, jwtVerification, urlSearchParamsValidator } from './middlewares';
import { restrictTo } from './middlewares';

@controller(`${API.start}user`)
@createRouterMiddlewareBefore(jwtVerification)
class UserController {
	@get('/')
	@use(urlSearchParamsValidator(userFields))
	@error(catchAsync)
	async getUsers(req: Request, res: Response, next: NextFunction) {
		await getAll(User, req, res, next);
	}

	@get('/me')
	@use(urlSearchParamsValidator([], ['select']))
	@error(catchAsync)
	async getMe(req: Request, res: Response, next: NextFunction) {
		req.params.id = req.user._id;
		await getOne(User, req, res, next);
	}
	@get('/:id')
	@use(urlSearchParamsValidator([], ['select']))
	@error(catchAsync)
	async getUser(req: Request, res: Response, next: NextFunction) {
		await getOne(User, req, res, next);
	}

	@patch('/updateMe')
	@error(catchAsync)
	@use(
		bodyValidator(
			{ required: false, values: userFields },
			{ required: true, values: ['password', 'passwordConfirmation'] }
		)
	)
	async updateMe(req: Request, res: Response, next: NextFunction) {
		const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
			runValidators: true,
			new: true,
		});
		res.status(200).jsend.success({ result: updatedUser });
	}

	@del('/deleteMe')
	@error(catchAsync)
	async deleteMe(req: Request, res: Response, next: NextFunction) {
		await User.findByIdAndUpdate(req.user._id, { active: false });
		res.status(204).jsend.success('User deleted successfully');
	}
	@del('/:id')
	@error(catchAsync)
	@use(restrictTo('admin'))
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		await deleteOne(User, req, res, next);
	}
	@patch('/:id')
	@error(catchAsync)
	@use(restrictTo('admin'), bodyValidator({ required: false, values: userFields })) //when pass false and value every body properties should be in values
	async updateUser(req: Request, res: Response, next: NextFunction) {
		await updateOne(User, req, res, next);
	}
}
