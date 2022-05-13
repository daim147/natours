export class CustomError {
	name: string = 'helo';
	statusCode: number = 500;
	status: 'error' | 'fail' = 'error';
	message: string = 'hello';
	stack: string = 'hello';
	constructor(content: string | CustomError) {
		if (typeof content === 'string') {
			this.message = content;
			return;
		} else {
			for (let i in content) {
				const key = i as keyof CustomError;
				//@ts-ignore
				this[key] = content[key];
			}
		}
	}
}
