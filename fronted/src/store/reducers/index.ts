import { combineReducers } from 'redux';
import userReducer from './userReducers';
import tourReducer from './tourReducers';
const reducers = combineReducers({
	user: userReducer,
	tours: tourReducer,
});
export type RootState = ReturnType<typeof reducers>;
export default reducers;
