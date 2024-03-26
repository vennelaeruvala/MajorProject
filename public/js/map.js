mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng,   lat]
    zoom: 9 //  starting zoom
});
// const marker = new mapboxgl.Marker({ color: 'red'})
//     .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
//     .setPopup(
//         new mapboxgl.Popup({offset : 25})
//         .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
//     )
//     .addTo(map);

    const geojson = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': listing.geometry.coordinates
            },
            'properties': {
              'title': listing.title,
              'description': 'Exact location provided after booking'
            }
          },
        ]
      };

      // add markers to map
      for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add it to the map
        new mapboxgl.Marker(el)
          .setLngLat(listing.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
              )
          )
          .addTo(map);
        }