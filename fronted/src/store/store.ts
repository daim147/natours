import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
export const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunk)));
// store.dispatch(loginUser({ email: 'admin@natours.io', password: 'test1234' }));
export type AppDispatch = typeof store.dispatch;
