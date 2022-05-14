import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
//Handling synchronously error
process.on('uncaughtException', (err: Error) => {
	console.log(err.name + ' | ' + err.message);
	console.log('Unhandled Exception! 💥 Shutting down');
	process.exit(1);
});
import { App } from './src/App';
import './src/controller/RootController';
import './src/controller/AuthController';
import './src/controller/UserController';
import './src/controller/TourController';
import './src/controller/ErrorController'; //make sure import it at the end
// initialize env
dotenv.config({ path: path.join(__dirname, '../config.env') });
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
