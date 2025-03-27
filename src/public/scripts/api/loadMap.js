async function addRoute(start, end, map, key) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${key}`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };

  const marker = new mapboxgl.Marker({
    color: "#03a5fc",
    draggable: false,
  }).setLngLat(end).addTo(map);

  map.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: geojson
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75
    }
  });
}

function loadMap(start, end=null) {
  const getMap = new XMLHttpRequest();
  getMap.onload = function() {
    let key = JSON.parse(this.response).key;
    mapboxgl.accessToken = key;
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: start, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const marker = new mapboxgl.Marker({
      color: "#03a5fc",
      draggable: false,
    }).setLngLat(start).addTo(map);
    
    if (end) addRoute(start, end, map, key);
  }
  getMap.open("GET", `/api/getmap`);
  getMap.send();
}
