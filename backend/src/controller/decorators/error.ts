import type { RequestHandler } from 'express';

import { MetaDataKeys } from '../../enums';
import { RouteHandlerDescriptor } from '../../interfaces';
type Handler = (fn: RequestHandler) => RequestHandler;
export const error = function (func: Handler) {
	return function (target: any, key: string, desc: RouteHandlerDescriptor) {
		Reflect.defineMetadata(MetaDataKeys.errorHandler, func, target, key);
	};
};
