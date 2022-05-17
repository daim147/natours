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
export const nonFilter = ['sort', 'limit', 'select', 'page'] as const;
export type nonFilterPropertiesArray = Readonly<typeof nonFilter[number][]>;
