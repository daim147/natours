import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { CustomError } from '../../interfaces';

export const deleteOne = async function <T>(
	Model: mongoose.Model<T, {}, {}, {}>,
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const doc = await Model.findByIdAndDelete(req.params.id);
	if (!doc) {
		if (!doc) return next(new CustomError('No Record Found', 404));
	}
	res.status(204).jsend.success({ result: { _id: doc._id } });
};
