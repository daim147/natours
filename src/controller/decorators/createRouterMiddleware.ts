import { RequestHandler } from 'express';

import { MetaDataKeys } from '../../enums';

export function createRouterMiddleware(middleware: RequestHandler) {
	return function (target: any) {
		const middlewares = Reflect.getMetadata(MetaDataKeys.middleware, target.prototype) || [];
		Reflect.defineMetadata(MetaDataKeys.middleware, [...middlewares, middleware], target.prototype);
	};
}
