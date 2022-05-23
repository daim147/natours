import { RequestParamHandler, RequestHandler, Router } from 'express';
export interface filesData {
	[key: string]: { name: string; content: string; path: string };
}

export interface paramsMiddleware {
	middleware: RequestParamHandler;
	param: string;
}
export interface middlewareObj {
	middleware: RequestHandler | Router;
	path: string;
}

export interface RouteHandlerDescriptor extends PropertyDescriptor {
	value?: RequestHandler;
}

type convertEnumToTypeArray<T extends Readonly<Array<T[number]>>> = Readonly<Array<T[number]>>;
export const nonFilter = ['sort', 'limit', 'select', 'page'] as const;
export type nonFilterPropertiesArray = convertEnumToTypeArray<typeof nonFilter>;

export const userRole = ['user', 'guide', 'lead-guide', 'admin'] as const;
export type UserRole = convertEnumToTypeArray<typeof userRole>;

type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;
type ReturnType<T> = T extends (...arg: any[]) => infer K ? K : never;
type abc = ReturnType<() => ['a', 'b', 'c', 'd', 'e', 'f']>;
type a = Exclude<'a' | 'b' | 'c', 'a'>;
