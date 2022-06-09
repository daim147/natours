import express, {
	type Express,
	type RequestHandler,
	type Router,
	type ErrorRequestHandler,
	type RouterOptions,
} from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import expressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import fs from 'fs';
// import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import jsend from 'jsend';
import { Server } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { API } from './enums';
import { Tour } from './model/tourModel';
import { User } from './model/userModel';
import { Review } from './model/reviewModel';

export class App {
	private static inst: Express;
	private constructor() {}
	static server: Server;
	static get Instance(): typeof App.inst {
		if (!App.inst) {
			const limit = rateLimit({
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
				message: 'You have reached 100 requests per 15 minutes try again after 15 minutes',
			});
			App.inst = express();
			//get Cookies
			App.inst.use(cookieParser());
			//Setting Cors
			App.inst.use(cors());
			//Setting Up View Engine
			App.inst.set('view engine', 'pug');
			//Setting Up Views Folder
			App.inst.set('views', path.join(__dirname, 'views'));
			//Serving Static Files
			App.inst.use(express.static(path.join(__dirname, '../public')));
			//Set security http headers
			App.inst.use(
				helmet({
					contentSecurityPolicy: false,
					crossOriginEmbedderPolicy: false,
					crossOriginResourcePolicy: false,
				})
			);
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
			//JSEND for sending meaningful Response
			App.inst.use(jsend.middleware);
			//Attaching Request Time
			App.inst.use((req, _, next) => {
				req.requestTime = new Date().toISOString();
				next();
			});
			//Prevent HTTP Parameters Pollution
			//App.inst.use(hpp()); //can be use but I have already implemented some kind of functionality in handleNonFilterProperty function
		}
		return App.inst;
	}
	static start(port: number, callBack: () => void) {
		App.server = App.Instance.listen(port, callBack);
	}
	static async connectDB(reloadDatabase: boolean = false) {
		const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!)!;
		await mongoose.connect(DB).then(() => {
			console.log('Database connection established successfully ');
		});
		if (reloadDatabase) {
			await Tour.deleteMany({});
			await User.deleteMany({});
			await Review.deleteMany({});
			await Tour.create(JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data/data/tours.json'), 'utf8')));
			await User.create(JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data/data/users.json'), 'utf8')), {
				validateBeforeSave: false,
			});
			await Review.create(JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-data/data/reviews.json'), 'utf8')));
			console.log('Done');
		}
	}
	static registerMiddleware(
		middleWareMethod: keyof Express,
		handler: RequestHandler | ErrorRequestHandler,
		path?: string,
		middlewares?: RequestHandler[]
	): void {
		App.Instance[middleWareMethod](path || '', ...(middlewares || []), handler);
	}
	static createRouter(options: RouterOptions = {}): Router {
		return express.Router(options);
	}
}
