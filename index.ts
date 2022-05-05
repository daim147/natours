import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';

import { App } from './src/App';
import { initialFileLoad } from './src/fileLoaders';
import './src/controller/RootController';
import './src/controller/TourController';
// initialize env
dotenv.config({ path: path.join(__dirname, '../config.env') });

initialFileLoad(path.join(__dirname, '../dev-data/data/tours.json'));
// DB Connection
App.connectDB();
const port = Number(process.env.PORT) || 3000;
App.start(port, () => {
	console.log('Server listening on port 3000');
});
