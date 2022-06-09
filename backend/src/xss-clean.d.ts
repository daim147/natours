const { RequestHandler } = require('express');
declare module 'xss-clean' {
	const xss: () => RequestHandler;
	export default xss;
}
