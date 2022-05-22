import { NextFunction, Request, Response } from 'express';

import { API } from '../enums';
import { bodyValidator, urlSearchParamsValidator, catchAsync, jwtVerification, restrictTo } from './middlewares';
import { CustomError } from '../interfaces';
import { controller, error, get, use, createRouterMiddleware, post } from './decorators';
import { Review, reviewFields, reviewRequired } from '../model/reviewModel';
import { queryWithNonFilter } from '../../utils';

@controller(`${API.start}reviews`)
@createRouterMiddleware(jwtVerification)
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
	@use(bodyValidator({ required: true, values: reviewRequired }))
	async postReview(req: Request, res: Response, next: NextFunction) {
		const review = await Review.create(req.body);
		res.status(201).jsend.success({ result: review });
	}
}
