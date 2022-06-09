import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import OverviewPage from './pages/overviewPage';
import LoginPage from './pages/loginPage';
import TourPage from './pages/tourPage';
import { history } from './utils';
import Reviews from './pages/Reviews';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<HistoryRouter history={history}>
					<Routes>
						<Route path='/' element={<App />}>
							<Route index element={<OverviewPage />} />
							<Route path='tour/:slug' element={<TourPage />} />
							<Route path='tour/reviews' element={<Reviews />} />
						</Route>
						<Route path='login' element={<LoginPage />} />
					</Routes>
				</HistoryRouter>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>
);
