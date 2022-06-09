import axios from 'axios';
import type { Dispatch } from 'redux';
import { apiVersion, history } from '../../utils';
import { Actions, UserAction, TourAction } from '../actions';
import { ActionTypes } from '../actionTypes';
import { RootState } from '../reducers';

interface LoginUser {
	email: string;
	password: string;
}
// export const loginUser: ActionCreator<ThunkAction<Promise<Action>, UserAction, {}, AnyAction>> =
export const loginUser =
	(credentials: LoginUser) =>
	async (dispatch: Dispatch<Actions>, getState: () => RootState): Promise<UserAction | void> => {
		try {
			dispatch({
				type: ActionTypes.SET_USER,
				payload: {
					loading: true,
				},
			});

			const response = await axios({
				method: 'POST',
				url: `${apiVersion}/auth/login`,
				data: credentials,
			});
			return dispatch({
				type: ActionTypes.SET_USER,
				payload: {
					user: response.data.data,
				},
			});
		} catch (error: any) {
			console.error(error);
			return dispatch({
				type: ActionTypes.SET_USER,
				payload: {
					error: error.message,
				},
			});
		}
	};
export const getTours =
	() =>
	async (dispatch: Dispatch<Actions>, getState: () => RootState): Promise<TourAction | void> => {
		try {
			dispatch({
				type: ActionTypes.SET_TOURS,
				payload: {
					loading: true,
				},
			});
			const response = await axios.get(`${apiVersion}/tours`);
			return dispatch({
				type: ActionTypes.SET_TOURS,
				payload: {
					tours: response.data.data,
				},
			});
		} catch (error: any) {
			if (error.response.status === 401) {
				history.replace('/login');
			}
			dispatch({
				type: ActionTypes.SET_TOURS,
				payload: {
					error: error.message,
				},
			});
			console.log(error);
		}
	};
