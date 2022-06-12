import { Link } from 'react-router-dom';
import { useTypeSelector } from '../hooks/useTypedSelector';
import { api } from '../utils';

const Header = () => {
	const { user } = useTypeSelector((state) => state.user);
	return (
		<header className='header'>
			<nav className='nav nav--tours'>
				<Link to='/' className='nav__el'>
					All tours
				</Link>
				<form className='nav__search'>
					<button className='nav__search-btn'>
						<svg>
							<use xlinkHref='/img/icons.svg#icon-search'></use>
						</svg>
					</button>
					<input type='text' placeholder='Search tours' className='nav__search-input' />
				</form>
			</nav>
			<div className='header__logo'>
				<img src={`${api}/img/logo-white.png`} alt='Natours logo' />
			</div>
			<nav className='nav nav--user'>
				<a href='/' className='nav__el'>
					My bookings
				</a>
				{/* <button className='nav__el'>Log out</button> */}
				<a href='/' className='nav__el'>
					<img
						src={`${api}/img/users/${user?.result.photo}`}
						alt={user?.result.name}
						className='nav__user-img'
					/>
					<span>Jonas</span>
				</a>
			</nav>
		</header>
	);
};

export default Header;
