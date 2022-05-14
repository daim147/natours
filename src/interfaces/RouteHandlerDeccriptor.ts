import { RequestHandler } from 'express';

export interface RouteHandlerDescriptor extends PropertyDescriptor {
	value?: RequestHandler;
}
