import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
	try {
		// 1) Get checkout session from API
		const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
		console.log(session);
		window.location.href = session.data.data.session.url;
	} catch (err) {
		console.log(err);
		showAlert('error', err);
	}
};
