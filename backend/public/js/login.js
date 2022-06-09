/* eslint-disable */
const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/auth/login',
			data: {
				email,
				password,
			},
		});
		console.log(res);
		if (res.data.status === 'success') {
			console.log('success', 'Logged in successfully!');
			// window.setTimeout(() => {
			// 	location.assign('/');
			// }, 1500);
		}
	} catch (err) {
		console.log('error', err.response.data.message);
	}
};

const logout = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: '/api/v1/users/logout',
		});
		if ((res.data.status = 'success')) location.reload(true);
	} catch (err) {
		console.log(err.response);
		showAlert('error', 'Error logging out! Try again.');
	}
};
const loginForm = document.querySelector('.form');
console.log(loginForm);
if (loginForm)
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});
