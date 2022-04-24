import { Request, Response } from 'express';
import { getFileLoadData, writeFile } from '../fileLoaders';
import { controller, get, post, use } from './decorators';
import { Api } from '../enums';
import { bodyValidator, paramsValidator } from './middlewares';
import { filesData } from '../interfaces/filesData';

@controller(`${Api.start}tours`)
class TourController {
	get tours(): () => filesData[keyof filesData] {
		return getFileLoadData('tours');
	}
	@get('/')
	getTours(req: Request, res: Response): void {
		const { content } = this.tours();
		console.log('request');
		const data = JSON.parse(content);
		res.status(200).json({ status: 'success', results: data.length, data });
	}

	@post('/')
	@use(bodyValidator('duration', 'name', 'difficulty'))
	async postTours(req: Request, res: Response): Promise<void> {
		const { content, path } = this.tours();
		const lastTours = JSON.parse(content);
		const newTours = { id: lastTours.at(-1).id + 1, ...req.body };
		const stringifyData = JSON.stringify([...lastTours, newTours]);
		const data = await writeFile(path, stringifyData);
		const parsed = JSON.parse(data.content);
		res.status(201).json({ status: 'success', results: parsed });
	}

	// @get('/:id/:name?')
	@get('/:id')
	@use(paramsValidator('id')) //here we don't need it but just for example'
	getTour(req: Request, res: Response): void {
		const { content } = this.tours();
		const data = JSON.parse(content);
		const id = +req.params.id;
		const tourData = data.find((tour: any) => tour.id === id);
		if (!tourData) {
			res.status(404).json({ status: '404 Not Found' });
			return;
		}
		res.status(200).json({ status: 'success', data: tourData });
	}
}
