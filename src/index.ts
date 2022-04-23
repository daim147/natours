import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { AppRouter } from './AppRouter';
import { initialFileLoad } from './fileLoaders';
import './controller/RootController';
import './controller/TourController';
const app = express();

initialFileLoad(path.join(__dirname, '../dev-data/data/tours.json'));
app.use(express.json());
app.use(AppRouter.Instance);

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
