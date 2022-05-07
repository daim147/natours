import { Request, Response } from 'express';
import { controller, del, get, patch, post, use, createRouterMiddleware, params } from './decorators';
import { Api } from '../enums';
import {
	bodyValidator,
	paramsValidator,
	queryValidator,
	removePropertiesFromQuery,
	sampleMiddleware,
	sampleParamsMiddleware,
} from './middlewares';
import { Tours, tourRequired, tourFields } from '../model/tourModel';

//for defining middleware order matter here the execution order is from bottom to top
@controller(`${Api.start}tours`)
@createRouterMiddleware(sampleMiddleware)
@params('id', sampleParamsMiddleware)
class TourController {
	@get('/')
	//check that query object property should be in schema
	@use(queryValidator(...tourFields)) //here order matter we need filter query object here so removePropertiesFromQuery should run first order of execution is bottom to top
	//remove these properties from the query object
	@use(removePropertiesFromQuery('page', 'sort', 'limit', 'fields'))
	async getTours(req: Request, res: Response): Promise<void> {
		try {
			const data = await Tours.find(req.filterQuery || req.query);
			res.status(200).json({ status: 'success', results: data.length, data });
		} catch (error) {
			res.status(400).json({ status: 'fail', message: error });
		}
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
