import type { NextFunction, Request, Response } from 'express';
import type { Model } from 'mongoose';

import { CustomError } from '../../interfaces';
export const updateOne = async function <T>(
	Model: Model<T, {}, {}, {}>,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!doc) return next(new CustomError('Invalid Id', 404));
	res.status(200).jsend.success({ result: doc });
};
