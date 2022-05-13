import { RequestHandler } from 'express';
import { MetaDataKeys } from '../../enums';
type Handler = (fn: RequestHandler) => RequestHandler;
export const error = function (func: Handler) {
	return function (target: any, key: string, desc: PropertyDescriptor) {
		Reflect.defineMetadata(MetaDataKeys.errorHandler, func, target, key);
	};
};
