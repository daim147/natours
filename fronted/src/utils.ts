import { createBrowserHistory } from 'history';

export const api = 'http://localhost:3000';
export const apiVersion = `/api/v1`;
export const toSimpleDate = (date: string) =>
	new Date(date).toLocaleString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' });
export const history = createBrowserHistory({ window });

export const random = () => Math.random().toString(36);
