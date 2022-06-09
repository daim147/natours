import { App } from '../App';
import { errorHandler, notFoundHandler } from './middlewares';

// register not found handler
App.registerMiddleware('all', notFoundHandler, '*', []);
// register error handler
App.registerMiddleware('use', errorHandler);
