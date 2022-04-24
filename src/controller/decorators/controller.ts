import { AppRouter } from '../../AppRouter';
import { MetaDataKeys, Methods } from '../../enums';

export function controller(pathPrefix: string) {
	return function (target: Function) {
		const router = AppRouter.Instance;
		for (let key in target.prototype) {
			const routeHandler = target.prototype[key].bind(target.prototype);
			const path = Reflect.getMetadata(MetaDataKeys.path, target.prototype, key);
			const method: Methods = Reflect.getMetadata(MetaDataKeys.method, target.prototype, key);
			const middlewares = Reflect.getMetadata(MetaDataKeys.middleware, target.prototype, key) || [];

			if (path) {
				router[method](`${pathPrefix}${path}`, ...middlewares, routeHandler);
			}
		}
	};
}
