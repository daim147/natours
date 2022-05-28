import type { NextFunction, Request, Response } from 'express';
import type { FilterQuery, Model } from 'mongoose';
import type { Query } from 'express-serve-static-core';
import { queryWithNonFilter } from '../../utils';

export const getAll = async function <T>(
	Model: Model<T, {}, {}, {}>,
	req: Request,
	res: Response,
	next: NextFunction,
	filter?: FilterQuery<Query>
) {
	const query = queryWithNonFilter(Model.find({ ...req.filterQuery, ...filter }), req.nonFilterQuery);
	const doc = await query; //query.getFilter() to get Filters
	res.status(200).jsend.success({ count: doc.length, result: doc });
};
