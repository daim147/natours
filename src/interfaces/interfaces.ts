import { RequestParamHandler, RequestHandler } from 'express';
export interface filesData {
	[key: string]: { name: string; content: string; path: string };
}

export interface paramsMiddleware {
	middleware: RequestParamHandler;
	param: string;
}

export interface RouteHandlerDescriptor extends PropertyDescriptor {
	value?: RequestHandler;
}
