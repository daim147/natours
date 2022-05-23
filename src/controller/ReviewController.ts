import { NextFunction, Request, Response } from 'express';

import { API } from '../enums';
import { bodyValidator, urlSearchParamsValidator, catchAsync, jwtVerification, restrictTo } from './middlewares';
import { controller, error, get, use, createRouterMiddlewareBefore, post } from './decorators';
import { Review, reviewFields, reviewRequired } from '../model/reviewModel';
import { queryWithNonFilter } from '../../utils';
import { App } from '../App';

export const router = App.createRouter({ mergeParams: true }); //mergeParams will merge the parent params with child one
@controller(`${API.start}reviews`, router)
@createRouterMiddlewareBefore(jwtVerification)
class ReviewsController {
	@get('/')
	@use(urlSearchParamsValidator(reviewFields))
	@error(catchAsync)
	async getAllReviews(req: Request, res: Response, next: NextFunction) {
		const query = queryWithNonFilter(Review.find(req.filterQuery), req.nonFilterQuery);
		const review = await query; //query.getFilter() to get Filters
		res.status(200).jsend.success({ count: review.length, result: review });
	}

	@post('/')
	@error(catchAsync)
	@use(bodyValidator({ required: false, values: reviewRequired }))
	async postReview(req: Request, res: Response, next: NextFunction) {
		req.body.tour ||= req.params.tourId;
		req.body.user ||= req.user._id;
		const review = await Review.create(req.body);
		res.status(201).jsend.success({ result: review });
	}
}

export default router;
