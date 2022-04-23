import { Request, Response } from 'express';
import { fileLoadData, getFileLoadData, writeFile } from '../fileLoaders';
import { controller, get, post } from './decorators';
import { use } from './decorators/use';
import { Api } from './enums';
import { bodyValidator, paramsValidator } from './middlewares';

@controller(`${Api.start}tours`)
class TourController {
	static tours = getFileLoadData('tours');
	@get('/')
	getTours(req: Request, res: Response) {
		const { content } = TourController.tours();
		const data = JSON.parse(content);
		res.status(200).json({ status: 'success', results: data.length, data });
	}

	@post('/')
	@use(bodyValidator('duration', 'name', 'difficulty'))
	async postTours(req: Request, res: Response) {
		const { content, path } = TourController.tours();
		const lastTours = JSON.parse(content);
		const newTours = { id: lastTours.at(-1).id + 1, ...req.body };
		const stringifyData = JSON.stringify([...lastTours, newTours]);
		const data = await writeFile(path, stringifyData);
		const parsed = JSON.parse(data.content);
		res.status(200).json({ status: 'success', results: parsed });
	}

	// @get('/:id/:name?')
	@get('/:id')
	@use(paramsValidator('id')) //here we don't need it but just for example'
	getTour(req: Request, res: Response) {
		const { content } = TourController.tours();
		const data = JSON.parse(content);
		const id = +req.params.id;
		const tourData = data.find((tour: any) => tour.id === id);
		if (!tourData) return res.status(404).json({ status: '404 Not Found' });
		res.status(200).json({ status: 'success', data: tourData });
	}
}
