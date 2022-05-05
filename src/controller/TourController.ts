import { Request, Response } from 'express';
import {
	controller,
	del,
	get,
	patch,
	post,
	use,
	createRouterMiddleware,
	params,
} from './decorators';
import { Api } from '../enums';
import {
	bodyValidator,
	paramsValidator,
	sampleMiddleware,
	sampleParamsMiddleware,
} from './middlewares';
import { Tours, tourRequired } from '../model/tourModel';
//example middleware

//for defining middleware order matter here the execution order is from bottom to top
@controller(`${Api.start}tours`)
@createRouterMiddleware(sampleMiddleware)
@params('id', sampleParamsMiddleware)
class TourController {
	@get('/')
	async getTours(req: Request, res: Response): Promise<void> {
		try {
			const data = await Tours.find();
			res.status(200).json({ status: 'success', results: data.length, data });
		} catch (error) {
			res.status(400).json({ status: 'fail', message: error });
		}
	}

	@post('/')
	@use(bodyValidator(...tourRequired))
	async postTours(req: Request, res: Response): Promise<void> {
		try {
			const newTour = await Tours.create(req.body);
			res.status(201).json({ status: 'success', results: newTour });
		} catch (error) {
			res.status(400).json({ status: 'fail', message: error });
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
	updateTour(req: Request, res: Response): void {}
	@del('/:id')
	deleteTour(req: Request, res: Response): void {}
}
