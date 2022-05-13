export class CustomError extends Error {
	name: string = '';
	private _statusCode: number = 500;
	status: 'error' | 'fail' = 'error';
	stack: string = 'HEllo';
	isOperational: boolean = true;
	constructor(message: string, code: number) {
		super(message);
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
