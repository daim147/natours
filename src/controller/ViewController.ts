import type { Request, Response } from 'express';
import { Tour } from '../model/tourModel';

import { controller, get } from './decorators';

@controller('/')
class RootController {
	@get('/')
	async getRoot(req: Request, res: Response) {
		const tours = await Tour.find();
		res.status(200).render('overview', {
			title: 'All Tours',
			tours,
		});
	}

	@get('/tour/:slug')
	async getTourPage(req: Request, res: Response) {
		const [tour] = await Tour.find({ slug: req.params.slug }).populate({
			path: 'reviews',
			select: 'review rating user',
		});
		res.status(200).render('tour', {
			title: tour.name + ' Tour',
			tour,
		});
	}
	@get('/tours/:slug')
	async getToursPage(req: Request, res: Response) {
		const tour = await Tour.find({ slug: req.params.slug }).populate({
			path: 'reviews',
			select: 'review rating user',
		});
		res.status(200).json(tour);
	}
}