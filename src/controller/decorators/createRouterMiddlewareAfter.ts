import { RequestHandler, Router } from 'express';

import { MetaDataKeys } from '../../enums';

export function createRouterMiddlewareAfter(middleware: RequestHandler | Router, path?: string) {
	return function (target: any) {
		const middlewares = Reflect.getMetadata(MetaDataKeys.afterMiddleware, target.prototype) || [];
		Reflect.defineMetadata(MetaDataKeys.afterMiddleware, [...middlewares, { path, middleware }], target.prototype);
	};
}
