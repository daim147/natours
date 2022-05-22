import express, { Express, RequestHandler, Router, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import expressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
// import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import jsend from 'jsend';
import { Server } from 'http';

import { API } from './enums';
export class App {
	private static inst: Express;
	private constructor() {}
	static server: Server;
	static get Instance(): typeof App.inst {
		if (!App.inst) {
			const limit = rateLimit({
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
				message: 'You have reached 100 requests per 15 minutes try again after 15 minutes',
			});
			App.inst = express();
			//Set security http headers
			App.inst.use(helmet());
			//Limit request from same IP address
			App.inst.use(API.start, limit);
			//Request Logger
			App.inst.use(morgan('dev'));
			//Body Parser, reading data from req.body
			App.inst.use(express.json({ limit: '50kb' }));
			//Data Sanitization against NoSQL query Injection
			App.inst.use(expressMongoSanitize());
			//Data Sanitization against XSS
			App.inst.use(xss());
			//Prevent HTTP Parameters Pollution
			//App.inst.use(hpp()); //can be use but I have already implemented some kind of functionality in handleNonFilterProperty function
			//Serving Static Files
			App.inst.use(express.static(path.join(__dirname, '../public')));
			//JSEND for sending meaningful Response
			App.inst.use(jsend.middleware);
			//Attaching Request Time
			App.inst.use((req, _, next) => {
				req.requestTime = new Date().toISOString();
				next();
			});
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
