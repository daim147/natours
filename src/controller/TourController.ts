import { Request, Response } from 'express';
import url from 'url';
import { controller, del, get, patch, post, use, createRouterMiddleware, params } from './decorators';
import { Api } from '../enums';
import {
	bodyValidator,
	paramsValidator,
	urlSearchParamsValidator,
	sampleMiddleware,
	sampleParamsMiddleware,
} from './middlewares';
import { Tours, tourRequired, tourFields } from '../model/tourModel';
import { objectToUrlParamString, queryWithNonFilter } from '../../utils';

const rootRoute = `${Api.start}tours`;
//for defining middleware order matter here the execution order is from bottom to top
@controller(rootRoute)
@createRouterMiddleware(sampleMiddleware)
@params('id', sampleParamsMiddleware)
class TourController {
	@get('/')
	//check that query object property should be in schema
	@use(urlSearchParamsValidator(tourFields))
	async getTours(req: Request, res: Response): Promise<void> {
		try {
			const data = await queryWithNonFilter(Tours.find(req.filterQuery), req.nonFilterQuery);
			res.status(200).json({ status: 'success', results: data.length, data });
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}

	@post('/')
	@use(bodyValidator(true, ...tourRequired)) //when pass true and value all the value should present in the body
	async postTours(req: Request, res: Response): Promise<void> {
		try {
			const newTour = await Tours.create(req.body);
			res.status(201).json({ status: 'success', results: newTour });
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}

	@patch('/:id')
	@use(bodyValidator(false, ...tourFields)) //when pass false and value every body properties should be in values
	async updateTour(req: Request, res: Response): Promise<void> {
		try {
			const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!tour) {
				throw new Error('Invalid Id');
			}
			res.status(200).json({ status: 'success', data: { tour } });
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}
	@del('/:id')
	async deleteTour(req: Request, res: Response): Promise<void> {
		try {
			const tour = await Tours.findByIdAndDelete(req.params.id);
			res.status(204).json({ status: 'success', data: { tour } });
		} catch (error: any) {
			res.status(404).json({ status: 'fail', message: error.message });
		}
	}
	@get('/top-5-cheap')
	async getTop(req: Request, res: Response): Promise<void> {
		const { query } = url.parse(req.url, true); //not using req.query as bcz of some manipulation express does to query
		const searchQuery = { limit: 5, sort: '-ratingsAverage,price', ...query };
		res.redirect(`${rootRoute}?${objectToUrlParamString(searchQuery)}`);
	}
	@get('/tour-stats')
	async getTourStats(req: Request, res: Response): Promise<void> {
		try {
			const stats = await Tours.aggregate([
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
			res.status(200).json({ status: 'success', data: { stats } });
		} catch (error: any) {
			res.status(404).json({ status: 'fail', message: error.message });
		}
	}

	@get('/monthly-plan/:year')
	async getMonthlyPlan(req: Request, res: Response): Promise<void> {
		try {
			const year = Number(req.params.year);
			const monthly = await Tours.aggregate([
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
			res.status(200).json({ status: 'success', results: monthly.length, data: { monthly } });
		} catch (error: any) {
			res.status(404).json({ status: 'fail', message: error.message });
		}
	}
	// @get('/:id/:name?')
	//putting params route at the end so that if /tours/* route that can be register before it other wise every thing after /tours/* will be routed to this route
	@get('/:id')
	@use(urlSearchParamsValidator(tourFields, ['select']))
	@use(paramsValidator('id')) //check if there is specified params here we don't need it but just for example'
	async getTour(req: Request, res: Response): Promise<void> {
		try {
			const data = await queryWithNonFilter(Tours.findById(req.params.id), req.nonFilterQuery);
			if (!data) throw new Error('No Record Found');
			res.status(200).json({ status: 'success', data });
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}
}
