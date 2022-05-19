import { NextFunction, Request, Response } from 'express';
import url from 'url';

import { controller, del, get, patch, post, use, error, createRouterMiddleware } from './decorators';
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
import { objectToUrlParamString, queryWithNonFilter } from '../../utils';
import { CustomError } from '../interfaces';

const rootRoute = `${API.start}tours`;
//for defining middleware order matter here the execution order is from bottom to top
// @params('id', sampleParamsMiddleware)
@controller(rootRoute)
@createRouterMiddleware(jwtVerification) //controller should be at the top bcz execution order is bottom to top
class TourController {
	@error(catchAsync)
	@get('/')
	//check that query object property should be in schema
	@use(urlSearchParamsValidator(tourFields))
	async getTours(req: Request, res: Response): Promise<void> {
		const tours = await queryWithNonFilter(Tour.find(req.filterQuery), req.nonFilterQuery);
		res.status(200).jsend.success({ count: tours.length, result: tours });
	}
	@error(catchAsync)
	@post('/')
	@use(bodyValidator(true, tourRequired)) //when pass true and value all the value should present in the body
	async postTours(req: Request, res: Response): Promise<void> {
		const newTour = await Tour.create(req.body);
		res.status(201).jsend.success({ result: newTour });
	}
	@error(catchAsync)
	@patch('/:id')
	@use(bodyValidator(false, tourFields)) //when pass false and value every body properties should be in values
	async updateTour(req: Request, res: Response, next: NextFunction): Promise<void> {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!tour) {
			if (!tour) return next(new CustomError('Invalid Id', 404));
		}
		res.status(200).jsend.success({ result: tour });
	}
	@error(catchAsync)
	@use(restrictTo('admin'))
	@del('/:id')
	async deleteTour(req: Request, res: Response, next: NextFunction): Promise<void> {
		const tour = await Tour.findByIdAndDelete(req.params.id);
		if (!tour) {
			if (!tour) return next(new CustomError('No Record Found', 404));
		}
		res.status(204).jsend.success({ result: { _id: tour._id } });
	}
	@get('/top-5-cheap')
	async getTop(req: Request, res: Response): Promise<void> {
		const { query } = url.parse(req.url, true); //not using req.query as bcz of some manipulation express does to query
		const searchQuery = { limit: 5, sort: '-ratingsAverage,price', ...query };
		res.redirect(`${rootRoute}?${objectToUrlParamString(searchQuery)}`);
	}
	@error(catchAsync)
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
	@error(catchAsync)
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
	@error(catchAsync)
	@use(urlSearchParamsValidator(tourFields, ['select']))
	@use(paramsValidator('id')) //check if there is specified params here we don't need it but just for example'
	async getTour(req: Request, res: Response, next: NextFunction): Promise<void> {
		const data = await queryWithNonFilter(Tour.findById(req.params.id), req.nonFilterQuery);
		if (!data) return next(new CustomError('No Record Found', 404));
		res.status(200).jsend.success({ result: data });
	}
}
