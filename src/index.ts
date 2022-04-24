import 'reflect-metadata';
import path from 'path';
import { App } from './App';
import { initialFileLoad } from './fileLoaders';
import './controller/RootController';
import './controller/TourController';

initialFileLoad(path.join(__dirname, '../dev-data/data/tours.json'));
App.start(3000, () => {
	console.log('Server listening on port 3000');
});
