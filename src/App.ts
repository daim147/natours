import express, { Express, RequestHandler, Router, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import jsend from 'jsend';
import { Server } from 'http';

export class App {
	private static inst: Express;
	private constructor() {}
	static server: Server;
	static get Instance(): typeof App.inst {
		if (!App.inst) {
			App.inst = express();
			App.inst.use(morgan('dev'));
			App.inst.use(express.json());
			App.inst.use(express.static(path.join(__dirname, '../public')));
			App.inst.use(jsend.middleware);
		}
		return App.inst;
	}
	static start(port: number, callBack: () => void) {
		App.server = App.Instance.listen(port, callBack);
	}
	static connectDB() {
		const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
		mongoose.connect(DB).then(() => {
			console.log('Database connection established successfully');
		});
	}
	static registerMiddleware(
		middleWareMethod: keyof Express,
		handler: RequestHandler | ErrorRequestHandler,
		path?: string,
		middlewares?: RequestHandler[]
	): void {
		App.Instance[middleWareMethod](path || '', ...(middlewares || []), handler);
	}
	static createRouter(): Router {
		return express.Router();
	}
}
