import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
const persistConfig = {
	key: 'user',
	storage,
	whitelist: ['user'],
};
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(persistedReducer, {}, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);

// store.dispatch(loginUser({ email: 'admin@natours.io', password: 'test1234' }));
export type AppDispatch = typeof store.dispatch;
