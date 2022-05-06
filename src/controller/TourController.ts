import { Request, Response } from 'express';
import mongoose from 'mongoose';
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
		} catch (error: any) {
			res.status(400).json({ status: 'fail', message: error.message });
		}
	}

	// @get('/:id/:name?')
	@get('/:id')
	@use(paramsValidator('id')) //check if there is specified params here we don't need it but just for example'
	async getTour(req: Request, res: Response): Promise<void> {
		try {
			console.log(typeof req.params.id);
			const data = await Tours.findById(req.params.id);
			res.status(200).json({ status: 'success', data });
		} catch (error) {
			res.status(400).json({ status: 'fail', message: error });
		}
	}

	@patch('/:id')
	async updateTour(req: Request, res: Response): Promise<void> {
		try {
			const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			res.status(200).json({ status: 'success', data: { tour } });
		} catch (error) {
			res.status(400).json({ status: 'fail', message: error });
		}
	}
	@del('/:id')
	async deleteTour(req: Request, res: Response): Promise<void> {
		try {
			const tour = await Tours.findByIdAndDelete(req.params.id);
			res.status(204).json({ status: 'success', data: { tour } });
		} catch (error) {
			res.status(404).json({ status: 'fail', message: error });
		}
	}
}
