import { Actions } from '../actions';
import { ActionTypes } from '../actionTypes';
import { User } from '../types';

const initialState = {
	loader: false,
	error: undefined,
	user: undefined,
};
export const reducer = (state: User = initialState, action: Actions) => {
	switch (action.type) {
		case ActionTypes.SET_USER:
			state = action.payload;
			return state;
		default:
			return state;
	}
};

export default reducer;
