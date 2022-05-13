import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';

import { App } from './src/App';
import './src/controller/RootController';
import './src/controller/TourController';

// initialize env
dotenv.config({ path: path.join(__dirname, '../config.env') });
// DB Connection
App.connectDB();
// register not found handler
App.registerMiddleware('all', App.notFoundHandler, '*', []);
// register error handler
App.registerMiddleware('use', App.errorHandler);
// starting server
const port = Number(process.env.PORT) || 3000;
App.start(port, () => {
	console.log('Server listening on port 3000');
});
