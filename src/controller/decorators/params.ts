import { RequestParamHandler } from 'express';

import { MetaDataKeys } from '../../enums';

export function params(param: string, middleware: RequestParamHandler) {
	return function (target: Function) {
		const params = Reflect.getMetadata(MetaDataKeys.params, target.prototype) || [];
		Reflect.defineMetadata(MetaDataKeys.params, [...params, { middleware, param }], target.prototype);
	};
}
