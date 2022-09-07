import type { Request, Response } from 'express';
import { CustomError } from '../interfaces';
import { Tour } from '../model/tourModel';

import { controller, get, post, use } from './decorators';
import { NextFunction } from 'express';
import { jwtVerification, isLoggedIn } from './middlewares';
import { Booking } from '../model/bookingModel';

@controller('/')
class RootController {
	@get('/')
	@use(isLoggedIn)
	async getRoot(req: Request, res: Response) {
		const tours = await Tour.find();
		res.status(200).render('overview', {
			title: 'All Tours',
			tours,
		});
	}

	@get('/tour/:slug')
	@use(isLoggedIn)
	async getTourPage(req: Request, res: Response, next: NextFunction) {
		const [tour] = await Tour.find({ slug: req.params.slug }).populate({
			path: 'reviews',
			select: 'review rating user',
		});

		if (!tour) {
			return next(new CustomError('There is no tour with that name.', 404));
		}
		res.status(200).render('tour', {
			title: tour.name + ' Tour',
			tour,
		});
	}

	@get('/login')
	async getLogin(req: Request, res: Response) {
		res.status(200).render('login', {
			title: 'Login',
		});
	}

	@get('/me')
	@use(jwtVerification)
	async getAccount(req: Request, res: Response) {
		res.status(200).render('account', {
			title: 'Your account',
		});
	}

	@get('/my-tours')
	@use(jwtVerification)
	async getMyBookings(req: Request, res: Response, next: NextFunction) {
		const bookings = await Booking.find({ user: req.user?._id });
		res.status(200).render('overview', {
			title: 'All Tours',
			tours: bookings.map((el) => el.tour),
		});
	}
	// @get('/signUp')
	// async getSeignUp(req: Request, res: Response) {
	// 	res.status(200).render('signup', {
	// 		title: 'Sign Up ',
	// 	});
	// }
}
