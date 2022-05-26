import { NextFunction, Request, Response } from 'express';
import url from 'url';

import {
	controller,
	del,
	get,
	patch,
	post,
	use,
	error,
	createRouterMiddlewareBefore,
	createRouterMiddlewareAfter,
} from './decorators';
import { API } from '../enums';
import {
	bodyValidator,
	paramsValidator,
	urlSearchParamsValidator,
	catchAsync,
	jwtVerification,
	restrictTo,
} from './middlewares';
import { Tour, tourRequired, tourFields } from '../model/tourModel';
import { objectToUrlParamString } from '../../utils';
import reviewRouter from './ReviewController';
import { createOne, deleteOne, getAll, getOne, updateOne } from './crudDelegators';
const rootRoute = `${API.start}tours`;

//for defining middleware order matter here the execution order is from bottom to top
// @params('id', sampleParamsMiddleware)
@controller(rootRoute)
@createRouterMiddlewareBefore(jwtVerification) //controller should be at the top bcz execution order is bottom to top
@createRouterMiddlewareAfter(reviewRouter, '/:tourId/review') //it will redirect this request to the review router
class TourController {
	@get('/')
	//check that query object property should be in schema
	@use(urlSearchParamsValidator(tourFields))
	async getTours(req: Request, res: Response, next: NextFunction): Promise<void> {
		await getAll(Tour, req, res, next);
	}

	@post('/')
	@use(bodyValidator({ required: true, values: tourRequired })) //when pass true and value all the value should present in the body
	async postTours(req: Request, res: Response): Promise<void> {
		await createOne(Tour, req, res);
	}

	@patch('/:id')
	@use(bodyValidator({ required: false, values: tourFields })) //when pass false and value every body properties should be in values
	async updateTour(req: Request, res: Response, next: NextFunction): Promise<void> {
		await updateOne(Tour, req, res, next);
	}

	@use(restrictTo('admin'))
	@del('/:id')
	async deleteTour(req: Request, res: Response, next: NextFunction): Promise<void> {
		await deleteOne(Tour, req, res, next);
	}
	@get('/top-5-cheap')
	async getTop(req: Request, res: Response): Promise<void> {
		const { query } = url.parse(req.url, true); //not using req.query as bcz of some manipulation express does to query
		const searchQuery = { limit: 5, sort: '-ratingsAverage,price', ...query };
		res.redirect(`${rootRoute}?${objectToUrlParamString(searchQuery)}`);
	}

	@get('/tour-stats')
	async getTourStats(req: Request, res: Response): Promise<void> {
		const stats = await Tour.aggregate([
			{
				$match: {
					ratingsAverage: { $gte: 2 },
				},
			},
			{
				$group: {
					_id: { $toUpper: '$difficulty' },
					numTours: { $sum: 1 },
					numRating: { $sum: '$ratingsQuantity' },
					avgRatings: { $avg: '$ratingsAverage' },
					avgPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
				},
			},
			{
				$sort: { avgPrice: 1 },
			},
		]);
		res.status(200).jsend.success({ count: stats.length, result: stats });
	}

	@get('/monthly-plan/:year')
	async getMonthlyPlan(req: Request, res: Response): Promise<void> {
		const year = Number(req.params.year);
		const monthly = await Tour.aggregate([
			{
				$unwind: {
					path: '$startDates',
				},
			},
			{
				$addFields: {
					startDates: {
						$toDate: '$startDates',
					},
				},
			},
			{
				$match: {
					startDates: {
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: {
						$month: '$startDates',
					},
					tourStartCount: {
						$sum: 1,
					},
					tours: {
						$push: '$name',
					},
					avgRating: {
						$avg: '$ratingsAverage',
					},
					avgPrice: {
						$avg: '$price',
					},
				},
			},
			{
				$addFields: {
					month: '$_id',
				},
			},
			{
				$unset: '_id',
			},
			{
				$sort: {
					tourStartCount: -1,
				},
			},
		]);
		res.status(200).jsend.success({ count: monthly.length, result: monthly });
	}
	// @get('/:id/:name?')
	//putting params route at the end so that if /tours/* route that can be register before it other wise every thing after /tours/* will be routed to this route
	@get('/:id')
	@use(urlSearchParamsValidator([], ['select']))
	@use(paramsValidator('id')) //check if there is specified params here we don't need it but just for example'
	async getTour(req: Request, res: Response, next: NextFunction): Promise<void> {
		await getOne(Tour, req, res, next, { path: 'reviews' });
	}
}
