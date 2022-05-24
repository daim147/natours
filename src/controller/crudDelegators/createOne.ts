import { Request, Response } from 'express';
import mongoose from 'mongoose';
export const createOne = async function <T>(Model: mongoose.Model<T, {}, {}, {}>, req: Request, res: Response) {
	const newDoc = await Model.create(req.body);
	res.status(201).jsend.success({ result: newDoc });
};
