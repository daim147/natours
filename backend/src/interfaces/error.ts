export class CustomError {
	name: string = '';
	_statusCode: number = 500;
	status: 'error' | 'fail' = 'error';
	stack: string = '';
	isOperational: boolean = true;
	constructor(public message: string, code: number) {
		this.statusCode = code;
		Error.captureStackTrace(this, this.constructor);
	}
	set statusCode(num: number) {
		this.status = num.toString().startsWith('4') ? 'fail' : 'error';
		this._statusCode = num;
	}
	get statusCode() {
		return this._statusCode;
	}
}
