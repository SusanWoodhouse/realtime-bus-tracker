const colors = [
	  '#f44336',
	  '#4caf50',
	  '#e91e63',
	  '#ffc107',
	  '#9c27b0',
	  '#cddc39',
	  '#673ab7',
	  '#8bc34a',
	  '#3f51b5',
	  '#2196f3',
	  '#ff9800',
	  '#03a9f4',
	  '#ff5722',
	  '#00bcd4',
	  '#795548',
	  '#009688',
	  '#9e9e9e',
	  '#ffeb3b',
	  '#607d8b'
	];
	
	mapboxgl.accessToken = "pk.eyJ1Ijoic3VzYW53b29kaG91c2UiLCJhIjoiY2xrbmRwa2IyMW1xYjNucWw2cjdsa2FsOSJ9.jNlNeE8t9HNH4Y8TLDotXw";
	
	const map = new mapboxgl.Map({
	  container: "map", // container ID
	  style: "mapbox://styles/mapbox/streets-v11", // style URL
	  center: [-71.104881, 42.365554], // starting position [lng, lat]
	  zoom: 12, // starting zoom
	});
	map.resize();
	
	let busesMarkers = [];
	
	async function run() {
	  // get bus data
	  const locations = await getBusLocations();
	  console.log(locations);
	
	  // Remove existing markers
	  eraseMarks();
	
	  locations.forEach((bus, i) => {
	    const marker = new mapboxgl.Marker({ "color": colors[i] })
	      .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
	      .setPopup(new mapboxgl.Popup({ offset: 25, closeOnClick: false, closeButton: false }).setHTML(`<h3>Bus ID <br>
	      ${bus.attributes.label}</h3>`))
	      .addTo(map)
	      .togglePopup();
	
	    busesMarkers.push(marker);
	  });
	
	  locations.forEach((marker, i) => {
	    const popUp = document.getElementsByClassName('mapboxgl-popup-content');
	    popUp[i].style.background = colors[i];
	  });
	
	  setTimeout(() => eraseMarks(), 7500);
	
	  // Set timer for next update
	  setTimeout(() => run(), 15000);
	}
	
	// Request bus data from MBTA
	async function getBusLocations() {
	  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	  const response = await fetch(url);
	  const json = await response.json();
	  return json.data;
	}
	
	function eraseMarks() {
	  busesMarkers.forEach(marker => marker.remove());
	  busesMarkers = [];
	}
	
	map.on('load', function () {
	  run();
	});