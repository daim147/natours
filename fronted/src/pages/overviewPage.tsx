import { api, apiVersion, toSimpleDate } from '../utils';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const OverviewPage = () => {
	const result = useQuery({
		queryKey: 'tours',
		queryFn: () => axios.get(`${apiVersion}/tours`),
		refetchOnMount: 'always',
	});
	if (result.isLoading) {
		return <h1>Loading</h1>;
	}
	return (
		<main className='main'>
			<div className='card-container'>
				{result.data?.data.data.result.map((tour: any) => (
					<div className='card' key={tour._id}>
						<div className='card__header'>
							<div className='card__picture'>
								<div className='card__picture-overlay'>&nbsp;</div>
								<img
									src={`${api}/img/tours/${tour.imageCover}`}
									alt='Tour 1'
									className='card__picture-img'
								/>
							</div>

							<h3 className='heading-tertirary'>
								<span>{tour.name}</span>
							</h3>
						</div>

						<div className='card__details'>
							<h4 className='card__sub-heading'>Easy {tour.duration}-day tour</h4>
							<p className='card__text'>{tour.summary}</p>
							<div className='card__data'>
								<svg className='card__icon'>
									<use xlinkHref={`../assets/img/icons.svg#icon-map-pin`}></use>
								</svg>
								<span>{tour.startLocation.description}</span>
							</div>
							<div className='card__data'>
								<svg className='card__icon'>
									<use xlinkHref={`../assets/img/icons.svg#icon-calendar`}></use>
								</svg>
								<span>{toSimpleDate(tour.startDates[0])}</span>
							</div>
							<div className='card__data'>
								<svg className='card__icon'>
									<use xlinkHref={`../assets/img/icons.svg#icon-flag`}></use>
								</svg>
								<span>{tour.locations.length} stops</span>
							</div>
							<div className='card__data'>
								<svg className='card__icon'>
									<use xlinkHref={`/img/icons.svg#icon-user`}></use>
								</svg>
								<span>{tour.maxGroupSize} people</span>
							</div>
						</div>

						<div className='card__footer'>
							<p>
								<span className='card__footer-value'>${tour.price}</span>
								<span className='card__footer-text'>per person</span>
							</p>
							<p className='card__ratings'>
								<span className='card__footer-value'>{tour.ratingsAverage}</span>
								<span className='card__footer-text'>{tour.ratingsQuantity}</span>
							</p>
							<Link to={`/tour/reviews`} className='btn btn--green btn--small'>
								Details
							</Link>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default OverviewPage;
