import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../../interfaces';
import { CastError, Error } from 'mongoose';
export const catchAsync =
	(fn: RequestHandler): RequestHandler =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (error: any) {
			next(error);
		}
	};

export const notFoundHandler = (req: Request, res: Response) => {
	res.jsend.error({
		code: 404,
		message: `Can't find the requested url ${req.originalUrl}`,
	});
};

const sendDevError = (err: CustomError, res: Response) => {
	res.status(err.statusCode).jsend[err.status]({
		message: err.message,
		code: err.statusCode,
		data: {
			stack: err.stack,
			error: err,
		},
	});
};
const sendProdError = (err: CustomError, res: Response) => {
	if (err.isOperational) {
		res.status(err.statusCode).jsend[err.status]({
			message: err.message,
			code: err.statusCode,
		});
	} else {
		console.error('Error 💥 ', err);
		res.status(500).jsend.error('Something went wrong');
	}
};

const handleCastErrorDB = (err: CastError) => {
	console.error(err);
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new CustomError(message, 400);
};
const handleDuplicateFieldsDB = (err: any) => {
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new CustomError(message, 400);
};
const handleValidationErrorDB = (err: Error.ValidationError) => {
	const errors = Object.values(err.errors).map((el: any) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new CustomError(message, 400);
};

const handleJWTError = () => new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new CustomError('Your token has expired! Please log in again.', 401);

export const errorHandler = (err: any, _: Request, res: Response, next: NextFunction) => {
	err.statusCode ||= 500;
	err.status ||= 'error';
	if (process.env.NODE_ENV === 'production') {
		let error = Object.create(err);
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
		sendProdError(error, res);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
	} else if (process.env.NODE_ENV === 'development') {
		sendDevError(err, res);
	}
};
