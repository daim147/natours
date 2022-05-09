import { Request, Response } from 'express';
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
import { deepClone, objectToUrlParamString, queryWithFilterAndNonFilter } from '../../utils';

//for defining middleware order matter here the execution order is from bottom to top
const rootRoute = `${Api.start}tours`;
@controller(rootRoute)
@createRouterMiddleware(sampleMiddleware)
@params('id', sampleParamsMiddleware)
class TourController {
	@get('/')
	//check that query object property should be in schema
	@use(urlSearchParamsValidator(tourFields))
	async getTours(req: Request, res: Response): Promise<void> {
		try {
			const data = await queryWithFilterAndNonFilter(Tours, req.filterQuery, req.nonFilterQuery);
			res.status(200).json({ status: 'success', results: data.length, data });
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}

	@get('/top-5-cheap')
	async getTop5Cheap(req: Request, res: Response): Promise<void> {
		req.query.limit ||= '5';
		req.query.sort ||= '-ratingsAverage,price';
		const query = deepClone(req.query);
		res.redirect(`${rootRoute}?${objectToUrlParamString(query)}`);
	}

	@post('/')
	//when pass true and value all the value should present in the body
	@use(bodyValidator(true, ...tourRequired))
	async postTours(req: Request, res: Response): Promise<void> {
		try {
			const newTour = await Tours.create(req.body);
			res.status(201).json({ status: 'success', results: newTour });
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}

	// @get('/:id/:name?')
	@get('/:id')
	@use(paramsValidator('id')) //check if there is specified params here we don't need it but just for example'
	async getTour(req: Request, res: Response): Promise<void> {
		try {
			const data = await Tours.findById(req.params.id);
			res.status(200).json({ status: 'success', data });
		} catch (error) {
			res.status(400).json({ status: 'fail', message: error });
		}
	}

	@patch('/:id')
	//when pass false and value every body properties should be in values
	@use(bodyValidator(false, ...tourFields))
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
}
