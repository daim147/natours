import express from 'express';
export class AppRouter {
	private static inst: express.Router;
	private constructor() {}
	static get Instance(): typeof AppRouter.inst {
		if (!AppRouter.inst) {
			AppRouter.inst = express.Router();
		}
		return AppRouter.inst;
	}
}
