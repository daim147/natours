import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import { apiVersion, random, toSimpleDate } from '../utils';

const TourPage = () => {
	const param = useParams();
	const mapContainer = useRef(null);
	const map = useRef(null);
	const result = useQuery({
		queryKey: 'Tour-slug',
		queryFn: async () => axios.get(`${apiVersion}/tours/slug/${param.slug}`),
	});
	const data = result.data?.data.data.result[0];
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, []);
	useEffect(() => {
		try {
			if (map.current || !data) return; // initialize map only once
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/husnainsyed/cl3rv3lwh000b15muqtx740nw',
				accessToken:
					'pk.eyJ1IjoiaHVzbmFpbnN5ZWQiLCJhIjoiY2t0M2phdDQwMHhvdTJvcGs0OHd5Z3BqdiJ9.miHdhSCLdpugNWmgUtgPtw',
				scrollZoom: false,
			});
			data.locations.forEach((loc: any) => {
				new mapboxgl.Marker({
					anchor: 'bottom',
				})
					.setLngLat(loc.coordinates)
					.setPopup(new mapboxgl.Popup().setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`))
					.addTo(map.current)
					.togglePopup();
			});
			//@ts-ignore
			map.current.fitBounds(
				data.locations.map((loc: any) => loc.coordinates),
				{
					padding: {
						top: 300,
						bottom: 300,
						left: 500,
						right: 500,
					},
				}
			);
		} catch (e) {
			console.error(e);
		}
	});
	if (result.isLoading) {
		return <h1>Loading...</h1>;
	}
	const detailBox = (icon: string, text: string, label: string) => (
		<div className='overview-box__detail'>
			<svg className='overview-box__icon'>
				<use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
			</svg>
			<span className='overview-box__label'>{label}</span>
			<span className='overview-box__text'>{text}</span>
		</div>
	);
	return (
		<>
			<section className='section-header'>
				<div className='header__hero'>
					<div className='header__hero-overlay'>
						<>&nbsp;</>
					</div>
					<img
						src={`/img/tours/${data.imageCover}`}
						className='header__hero-img'
						alt={`${data.name}`}
					/>
				</div>
				<div className='heading-box'>
					<h1 className='heading-primary'>
						<span>{data.name} Tour</span>
					</h1>
					<div className='heading-box__group'>
						<div className='heading-box__detail'>
							<svg className='heading-box__icon'>
								<use xlinkHref='img/icons.svg#icon-clock'></use>
							</svg>
							<span className='heading-box__text'>{data.duration} days</span>
						</div>
						<div className='heading-box__detail'>
							<svg className='heading-box__icon'>
								<use xlinkHref='img/icons.svg#icon-map-pin'></use>
							</svg>
							<span className='heading-box__text'>{data.startLocation.description}</span>
						</div>
					</div>
				</div>
			</section>

			<section className='section-description'>
				<div className='overview-box'>
					<div>
						<div className='overview-box__group'>
							<h2 className='heading-secondary ma-bt-lg'>Quick facts</h2>
							{detailBox('calendar', 'Next Date', toSimpleDate(data.startDates[0]))}
							{detailBox('trending-up', 'Difficulty', data.difficulty)}
							{detailBox('user', 'Participants', `${data.maxGroupSize} people`)}
							{detailBox('star', 'Rating', `${data.ratingsAverage} / 5`)}
						</div>

						<div className='overview-box__group'>
							<h2 className='heading-secondary ma-bt-lg'>Your tour guides</h2>
							{data.guides.map((guide: any, i: number) => (
								<div className='overview-box__detail' key={guide.role + i + random()}>
									<img
										src={`/img/users/${guide.photo}`}
										alt={`${guide.name}`}
										className='overview-box__img'
									/>
									<span className='overview-box__label'>
										{guide.role === 'lead-guide'
											? 'Lead Guide'
											: guide.role === 'guide'
											? 'Tour Guide'
											: guide.role}
									</span>
									<span className='overview-box__text'>{guide.name}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='description-box'>
					<h2 className='heading-secondary ma-bt-lg'>About the park camper tour</h2>
					{data.description.split('\n').map((text: string, i: number) => (
						<p className='description__text' key={`description__text ${i} ${random()}`}>
							{text}
						</p>
					))}
				</div>
			</section>

			<section className='section-pictures'>
				{data.images.map((image: any, i: number) => (
					<div className='picture-box' key={`${data.name} ${i + 1} ${random()}`}>
						<img
							className={`picture-box__img picture-box__img--${i + 1}`}
							src={`/img/tours/${image}`}
							alt={`${data.name} ${i + 1}`}
						/>
					</div>
				))}
			</section>
			<section className='section-map'>
				<div id='map' ref={mapContainer}></div>
			</section>
			<section className='section-reviews'>
				<div className='reviews'>
					{data.reviews?.map((review: any, i: number) => (
						<div className='reviews__card' key={review.review + random()}>
							<div className='reviews__avatar'>
								<img
									src={`/img/users/${review.user.photo}`}
									alt={`${review.user.name}`}
									className='reviews__avatar-img'
								/>
								<h6 className='reviews__user'>{review.user.name}</h6>
							</div>
							<p className='reviews__text'>{review.review}</p>

							<div className='reviews__rating'>
								{[1, 2, 3, 4, 5].map((i) => (
									<svg
										key={review.rating + i + random()}
										className={`reviews__star reviews__star--${
											review.rating >= i ? 'active' : 'inactive'
										}`}
									>
										<use xlinkHref='/img/icons.svg#icon-star'></use>
									</svg>
								))}
							</div>
						</div>
					))}
				</div>
			</section>

			<section className='section-cta'>
				<div className='cta'>
					<div className='cta__img cta__img--logo'>
						<img src='/img/logo-white.png' alt='Natours logo' className='' />
					</div>
					<img
						src={`/img/tours/${data.images[1]}`}
						alt={`${data.name}`}
						className='cta__img cta__img--1'
					/>
					<img
						src={`/img/tours/${data.images[2]}`}
						alt={`${data.name}`}
						className='cta__img cta__img--2'
					/>

					<div className='cta__content'>
						<h2 className='heading-secondary'>What are you waiting for?</h2>
						<p className='cta__text'>
							{data.duration} days. 1 adventure. Infinite memories. Make it yours today!
						</p>
						<button className='btn btn--green span-all-rows'>Book tour now!</button>
					</div>
				</div>
			</section>
		</>
	);
};

export default TourPage;
