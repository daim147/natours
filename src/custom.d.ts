declare namespace Express {
	interface Request {
		filterQuery: {
			[key: string]: string;
		};
	}
}
