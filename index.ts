import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../config.env') });
process.on('uncaughtException', (err: Error) => {
	console.log(err.name + ' | ' + err.message);
	console.log('Unhandled Exception! 💥 Shutting down');
	process.exit(1);
});

import { App } from './src/App';
import './src/controller';
//!In Each Controller class every function is passwd to catchAsync function for error handling pass in case of your custom error handler function pass function to @error() decorators on the function

// DB Connection
App.connectDB();
const port = Number(process.env.PORT) || 3000;
// starting server
App.start(port, () => {
	console.log('Server listening on port 3000');
});

process.on('unhandledRejection', (err: Error) => {
	console.log(err.name + ' | ' + err.message);
	console.log('Unhandled rejection! 💥 Shutting down');
	App.server.close(() => {
		process.exit(1);
	});
});
