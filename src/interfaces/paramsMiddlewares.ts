import { RequestParamHandler } from 'express';
export interface paramsMiddleware {
	middleware: RequestParamHandler;
	param: string;
}
