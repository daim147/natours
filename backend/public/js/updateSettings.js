/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
	try {
		const url = type === 'password' ? '/api/v1/auth/updateMyPassword' : '/api/v1/user/updateMe';

		const res = await axios({
			method: 'PATCH',
			url,
			data,
		});
		console.log(res, data);
		if (res.data.status === 'success') {
			showAlert('success', `${type.toUpperCase()} updated successfully!`);
			if (type === 'password') location.reload(true);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
