import { Actions } from '../actions';
import { ActionTypes } from '../actionTypes';
import { Tour } from '../types';

const initialState: Tour = {
	loading: false,
	error: undefined,
	tours: undefined,
};
export const reducer = (state: Tour = initialState, action: Actions) => {
	switch (action.type) {
		case ActionTypes.SET_TOURS:
			state = action.payload;
			return state;
		default:
			return state;
	}
};

export default reducer;
