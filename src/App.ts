import express, {
	Express,
	RequestHandler,
	Router,
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import jsend from 'jsend';
import { CustomError } from './interfaces';
export class App {
	private static inst: Express;
	private constructor() {}
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
		App.Instance.listen(port, callBack);
	}
	static connectDB() {
		const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
		mongoose
			.connect(DB)
			.then(() => {
				console.log('Database connection established successfully');
			})
			.catch((err) => {
				console.log(err);
				process.exit(1);
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
	static notFoundHandler(req: Request, res: Response) {
		res.jsend.error({
			code: 404,
			message: `Can't find the requested url ${req.originalUrl}`,
		});
	}
	static errorHandler(err: CustomError, _: Request, res: Response, next: NextFunction) {
		err = new CustomError(err);
		res.status(err.statusCode).jsend[err.status](err.message);
	}
}
