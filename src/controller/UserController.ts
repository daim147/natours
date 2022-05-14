import { NextFunction, Request, Response } from 'express';
import { queryWithNonFilter } from '../../utils';
import { API } from '../enums';
import { CustomError } from '../interfaces';
import { User, userFields } from '../model/userModel';
import { controller, del, error, get, patch, use } from './decorators';
import { bodyValidator, catchAsync, urlSearchParamsValidator } from './middlewares';

@controller(`${API.start}user`)
class UserController {
	@get('/')
	@use(urlSearchParamsValidator(userFields))
	@error(catchAsync)
	async getUsers(req: Request, res: Response) {
		const users = await queryWithNonFilter(User.find(req.filterQuery), req.nonFilterQuery);
		res.status(200).jsend.success({ count: users.length, result: users });
	}

	@patch('/:id')
	@error(catchAsync)
	@use(bodyValidator(false, userFields)) //when pass false and value every body properties should be in values
	async updateUser(req: Request, res: Response, next: NextFunction) {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!updatedUser) {
			if (!updatedUser) return next(new CustomError('Invalid Id', 404));
		}
		res.status(200).jsend.success({ result: updatedUser });
	}

	@del('/:id')
	@error(catchAsync)
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			if (!user) return next(new CustomError('No Record Found', 404));
		}
		res.status(204).jsend.success({ result: { _id: user._id } });
	}

	@get('/:id')
	@use(urlSearchParamsValidator(userFields, ['select']))
	@error(catchAsync)
	async getUser(req: Request, res: Response, next: NextFunction) {
		const user = await queryWithNonFilter(User.findById(req.params.id), req.nonFilterQuery);
		if (!user) return next(new CustomError('No Record Found', 404));
		res.status(200).jsend.success({ result: user });
	}
}
