import { Router, RouterOptions } from 'express';
import { App } from '../../App';
import { MetaDataKeys, Methods } from '../../enums';
import { paramsMiddleware, middlewareObj } from '../../interfaces';
import { catchAsync } from '../middlewares';

export function controller(pathPrefix: string, router: Router = App.createRouter()) {
	return function (target: Function) {
		//register it after the route is matched
		const controllerMiddlewaresAfter: middlewareObj[] =
			Reflect.getMetadata(MetaDataKeys.afterMiddleware, target.prototype) || [];
		controllerMiddlewaresAfter.length &&
			controllerMiddlewaresAfter.forEach(({ path, middleware }) => {
				router.use(path || '', middleware);
			});
		//Then get the middlewares register for controller before the matched
		const controllerMiddlewaresBefore = Reflect.getMetadata(MetaDataKeys.middleware, target.prototype) || [];
		//Then check for the params middleware
		const params: paramsMiddleware[] = Reflect.getMetadata(MetaDataKeys.params, target.prototype) || [];
		params.length &&
			params.forEach(({ param, middleware }) => {
				router.param(param, middleware);
			});
		//Then iterate through the methods in controller
		for (let key in target.prototype) {
			// First get the method
			let routeHandler = target.prototype[key].bind(target.prototype);
			//Then get error handler
			const errorHandler = Reflect.getMetadata(MetaDataKeys.errorHandler, target.prototype, key);
			if (errorHandler) {
				routeHandler = errorHandler(routeHandler);
			} else {
				routeHandler = catchAsync(routeHandler);
			}
			//Then get the the path of which method is bound
			const path = Reflect.getMetadata(MetaDataKeys.path, target.prototype, key);
			// Then get the http method bound to controller method
			const method: Methods = Reflect.getMetadata(MetaDataKeys.method, target.prototype, key);
			// Then get the middleware registered to controller method
			const middlewares = Reflect.getMetadata(MetaDataKeys.middleware, target.prototype, key) || [];
			// After then register the controller method to http method and path to router
			if (path) {
				router[method](`${path}`, ...middlewares, routeHandler);
			}
		}
		// Then bind router with app (express.use())
		App.registerMiddleware('use', router, pathPrefix, controllerMiddlewaresBefore);
	};
}
