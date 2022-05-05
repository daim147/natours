import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import { App } from './App';
import { initialFileLoad } from './fileLoaders';
import './controller/RootController';
import './controller/TourController';

dotenv.config({ path: path.join(__dirname, '../config.env') });
initialFileLoad(path.join(__dirname, '../dev-data/data/tours.json'));
const port = Number(process.env.PORT) || 3000;
App.start(port, () => {
	console.log(process.env.NODE_ENV);
	console.log(process.env.PORT);

	console.log('Server listening on port 3000');
});
