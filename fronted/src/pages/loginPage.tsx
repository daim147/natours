import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActions } from '../hooks/useActions';
import { useTypeSelector } from '../hooks/useTypedSelector';

const LoginPage = () => {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const { loginUser } = useActions();
	const navigate = useNavigate();
	const { user } = useTypeSelector((state) => state.user);
	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);
	return (
		<main className='main'>
			<div className='login-form'>
				<h2 className='heading-secondary ma-bt-lg'>Log into your account</h2>
				<form
					className='form'
					onSubmit={async (e) => {
						e.preventDefault();
						loginUser(credentials);
					}}
				>
					<div className='form__group'>
						<label className='form__label' htmlFor='email'>
							Email address
						</label>
						<input
							className='form__input'
							id='email'
							type='email'
							placeholder='you@example.com'
							required={true}
							value={credentials.email}
							onChange={(e) => setCredentials((state) => ({ ...state, email: e.target.value }))}
						/>
					</div>
					<div className='form__group ma-bt-md'>
						<label className='form__label' htmlFor='password'>
							Password
						</label>
						<input
							className='form__input'
							id='password'
							type='password'
							placeholder='••••••••'
							value={credentials.password}
							required={true}
							minLength={8}
							onChange={(e) => setCredentials((state) => ({ ...state, password: e.target.value }))}
						/>
					</div>
					<div className='form__group'>
						<button className='btn btn--green'>Login</button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default LoginPage;
