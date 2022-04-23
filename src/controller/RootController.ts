import { Request, Response } from 'express';
import { controller, get } from './decorators';

@controller('')
class RootController {
	@get('/')
	getRoot(req: Request, res: Response) {
		res.send('Working');
	}

	@get('/hello')
	getHello(req: Request, res: Response) {
		res.send('Hello');
	}
}
