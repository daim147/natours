import { ActionTypes } from '../actionTypes';
import { Tour, User } from '../types';

export interface UserAction {
	type: ActionTypes.SET_USER;
	payload: User;
}
export interface TourAction {
	type: ActionTypes.SET_TOURS;
	payload: Tour;
}

export type Actions = UserAction | TourAction;
