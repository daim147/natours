/*eslint-disable */

export const displayMap = (locations) => {
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/husnainsyed/cl3rv3lwh000b15muqtx740nw',
		accessToken: 'pk.eyJ1IjoiaHVzbmFpbnN5ZWQiLCJhIjoiY2t0M2phdDQwMHhvdTJvcGs0OHd5Z3BqdiJ9.miHdhSCLdpugNWmgUtgPtw',
		scrollZoom: false,
	});

	locations.forEach((loc) => {
		new mapboxgl.Marker({
			anchor: 'bottom',
		})
			.setLngLat(loc.coordinates)
			.setPopup(new mapboxgl.Popup().setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`))
			.addTo(map)
			.togglePopup();
	});
	map.fitBounds(
		locations.map((loc) => loc.coordinates),
		{
			padding: {
				top: 200,
				bottom: 150,
				left: 100,
				right: 100,
			},
		}
	);
};
