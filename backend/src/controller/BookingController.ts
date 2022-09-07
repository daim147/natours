import type { NextFunction, Request, Response } from 'express';
import { API } from '../enums';
import { controller, createRouterMiddlewareBefore, del, get, patch, post, use } from './decorators';
import { bodyValidator, jwtVerification, restrictTo, urlSearchParamsValidator } from './middlewares';
import { Tour } from '../model/tourModel';
import Stripe from 'stripe';
import { Booking, bookingFields, bookingRequired } from '../model/bookingModel';
import { getOne, updateOne, deleteOne, createOne, getAll } from './crudDelegators';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2022-08-01',
});

@controller(`${API.start}booking`)
@createRouterMiddlewareBefore(jwtVerification) //controller should be at the top bcz execution order is bottom to top
class AuthController {
	@get('/')
	@use(urlSearchParamsValidator(bookingRequired))
	async createBookingCheckout(req: Request, res: Response, next: NextFunction) {
		// await Booking.create(req.filterQuery);
		// res.redirect(`${req.protocol}://${req.get('host')}/`);
		await getAll(Booking, req, res, next);
	}

	@get('/checkout-session/:tourId')
	async getCheckoutSession(req: Request, res: Response, next: NextFunction) {
		const tour = await Tour.findById(req.params.tourId);
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			success_url: `${req.protocol}://${req.get('host')}${API.start}booking?tour=${req.params.tourId}&user=${
				req.user?._id
			}&price=${tour?.price}`,
			cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?.slug}`,
			customer_email: req.user?.email,
			client_reference_id: req.params.tourId,
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: 'usd',
						unit_amount: tour?.price ? tour?.price * 100 : 0,
						product_data: {
							name: `${tour?.name} Tour`,
							description: tour?.summary,
							images: [`https://www.natours.dev/img/tours/${tour?.imageCover}`],
						},
					},
					quantity: 1,
				},
			],
		});

		res.status(200).jsend.success({ session });
	}

	@get('/:id')
	@use(urlSearchParamsValidator([], ['select']))
	async getAllBookings(req: Request, res: Response, next: NextFunction) {
		await getOne(Booking, req, res, next);
	}

	@patch('/:id')
	@use(restrictTo('admin', 'lead-guide'), bodyValidator({ required: false, values: bookingFields }))
	async updateBooking(req: Request, res: Response, next: NextFunction) {
		await updateOne(Booking, req, res, next);
	}

	@del('/:id')
	@use(restrictTo('admin', 'lead-guide'))
	async deleteBooking(req: Request, res: Response, next: NextFunction) {
		await deleteOne(Booking, req, res, next);
	}

	@post('/')
	@use(restrictTo('admin', 'lead-guide'), bodyValidator({ required: true, values: bookingRequired }))
	async postBooking(req: Request, res: Response) {
		await createOne(Booking, req, res);
	}
}
