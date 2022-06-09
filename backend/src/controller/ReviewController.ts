import type { NextFunction, Request, Response } from 'express';

import { API } from '../enums';
import { bodyValidator, urlSearchParamsValidator, jwtVerification, restrictTo } from './middlewares';
import { controller, get, use, createRouterMiddlewareBefore, post, del, patch } from './decorators';
import { Review, reviewFields, reviewRequired } from '../model/reviewModel';
import { App } from '../App';
import { createOne, deleteOne, getAll, getOne, updateOne } from './crudDelegators';

export const router = App.createRouter({ mergeParams: true }); //mergeParams will merge the parent params with child one
@controller(`${API.start}reviews`, router)
@createRouterMiddlewareBefore(jwtVerification)
class ReviewsController {
	@get('/')
	@use(urlSearchParamsValidator(reviewFields))
	async getAllReviews(req: Request, res: Response, next: NextFunction) {
		let filter = {};
		if (req.params.tourId) filter = { tour: req.params.tourId };
		await getAll(Review, req, res, next, filter);
	}

	@del('/:id')
	@use(restrictTo('admin', 'user'))
	async deleteReview(req: Request, res: Response, next: NextFunction) {
		await deleteOne(Review, req, res, next);
	}

	@patch('/:id')
	@use(restrictTo('admin', 'user'), bodyValidator({ required: false, values: reviewFields }))
	async updateReview(req: Request, res: Response, next: NextFunction) {
		await updateOne(Review, req, res, next);
	}
	@post('/')
	@use(
		restrictTo('admin', 'user'),
		bodyValidator({ required: (req) => (req.params.tourId && req.user ? false : true), values: reviewRequired })
	)
	async postReview(req: Request, res: Response) {
		req.body.tour ||= req.params.tourId;
		req.body.user ||= req.user._id;
		await createOne(Review, req, res);
	}

	@get('/:id')
	@use(urlSearchParamsValidator([], ['select']))
	async getReview(req: Request, res: Response, next: NextFunction) {
		await getOne(Review, req, res, next);
	}
}
export default router;
