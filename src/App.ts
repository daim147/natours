import express, { Express, RequestHandler, Router } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
export class App {
	private static inst: Express;
	private constructor() {}
	static get Instance(): typeof App.inst {
		if (!App.inst) {
			App.inst = express();
			App.inst.use(morgan('dev'));
			App.inst.use(express.json());
			App.inst.use(express.static(path.join(__dirname, '../public')));
		}
		return App.inst;
	}
	static start(port: number, callBack: () => void) {
		App.Instance.listen(port, callBack);
	}
	static connectDB() {
		const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
		mongoose
			.connect(DB)
			.then(() => {
				console.log('Database connection established successfully');
			})
			.catch((err) => console.log(err));
	}
	static registerRouterMiddleware(
		path: string,
		middlewares: RequestHandler[] = [],
		handler: RequestHandler
	): void {
		App.Instance.use(path, ...middlewares, handler);
	}
	static createRouter(): Router {
		return express.Router();
	}
}
