export enum API {
	start = '/api/v1/',
}

export enum MetaDataKeys {
	path = 'Path',
	method = 'Methods',
	middleware = 'Middleware',
	params = 'Params',
	errorHandler = 'ErrorHandler',
	afterMiddleware = 'AfterMiddleware',
}

export enum Methods {
	get = 'get',
	post = 'post',
	put = 'put',
	delete = 'delete',
	patch = 'patch',
}
