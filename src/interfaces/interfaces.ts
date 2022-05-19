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

type convertEnumToTypeArray<T extends Readonly<Array<T[number]>>> = Readonly<Array<T[number]>>;
export const nonFilter = ['sort', 'limit', 'select', 'page'] as const;
export type nonFilterPropertiesArray = convertEnumToTypeArray<typeof nonFilter>;

export const userRole = ['user', 'guide', 'lead-guide', 'admin'] as const;
export type UserRole = convertEnumToTypeArray<typeof userRole>;
