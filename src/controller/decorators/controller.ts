import { App } from '../../App';
import { MetaDataKeys, Methods } from '../../enums';
import { paramsMiddleware } from '../../interfaces';

export function controller(pathPrefix: string) {
	return function (target: Function) {
		//First create router (express.Router for every controller)
		const router = App.createRouter();
		//Then get the middlewares register for controller
		const controllerMiddlewares =
			Reflect.getMetadata(MetaDataKeys.middleware, target.prototype) || [];

		//Then check for the params middleware
		const params: paramsMiddleware[] =
			Reflect.getMetadata(MetaDataKeys.params, target.prototype) || [];
		params.length &&
			params.forEach(({ param, middleware }) => {
				router.param(param, middleware);
			});
		//Then iterate through the methods in controller
		for (let key in target.prototype) {
			// First get the method
			const routeHandler = target.prototype[key].bind(target.prototype);
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
		App.registerRouterMiddleware(pathPrefix, controllerMiddlewares, router);
	};
}
