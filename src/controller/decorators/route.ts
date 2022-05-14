import { RequestHandler } from 'express';
import { MetaDataKeys, Methods } from '../../enums';
import { RouteHandlerDescriptor } from '../../interfaces';

function routeBinder(method: string) {
	return function (path: string) {
		return function (target: any, key: string, desc: RouteHandlerDescriptor) {
			Reflect.defineMetadata(MetaDataKeys.path, path, target, key);
			Reflect.defineMetadata(MetaDataKeys.method, method, target, key);
		};
	};
}
export const get = routeBinder(Methods.get);
export const del = routeBinder(Methods.delete);
export const put = routeBinder(Methods.put);
export const post = routeBinder(Methods.post);
export const patch = routeBinder(Methods.patch);
