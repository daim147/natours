import { NextFunction, Request, Response } from 'express';
import mongoose, { PopulateOptions } from 'mongoose';
import { queryWithNonFilter } from '../../../utils';
import { CustomError } from '../../interfaces';
export const getOne = async function <T>(
	Model: mongoose.Model<T, {}, {}, {}>,
	req: Request,
	res: Response,
	next: NextFunction,
	options?: PopulateOptions
) {
	let query: any = Model.findById(req.params.id);
	if (options) {
		query = query.populate(options);
	}
	const data = await queryWithNonFilter(query, req.nonFilterQuery);
	if (!data) return next(new CustomError('No Record Found', 404));
	res.status(200).jsend.success({ result: data });
};
