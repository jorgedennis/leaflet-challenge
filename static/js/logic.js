// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Set up the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Fetch JSON 
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Parse JSON data and create map elements
    data.features.forEach(function (feature) {
      var coordinates = feature.geometry.coordinates;
      var magnitude = feature.properties.mag;
      var depth = coordinates[2];

      // Calculate marker the size and color 
      var size = Math.pow(1.7, magnitude) * 1.7;
      var color = getColor(depth);

      // Create a circle markers
      var marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: size,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth + ' km');

      // Add markers to the map
      marker.addTo(map);
    });

    // Create  legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend');
      var depths = [0, 70, 300];
      var labels = ['Shallow', 'Intermediate', 'Deep'];
      var gradientColors = ['#e31a1c', '#feb24c', '#1f78b4'];

      div.innerHTML += '<strong>Depth</strong><br>';
      for (var i = 0; i < depths.length; i++) {
        var gradientStop =
          i === depths.length - 1 ? '100%' : (depths[i] / depths[depths.length - 1]) * 100 + '%';
        div.innerHTML +=
          '<i style="background:' +
          gradientColors[i] +
          '; width: 20px; height: 10px; display: inline-block;"></i> ' +
          '<span>' +
          labels[i] +
          '</span><br>';
        div.innerHTML +=
          '<div style="background: linear-gradient(to right, ' +
          gradientColors[i] +
          ' 0%, ' +
          gradientColors[i + 1] +
          ' ' +
          gradientStop +
          '); height: 10px;"></div>';
      }
      return div;
    };
    legend.addTo(map);
  })
  .catch(function(error) {
    console.log('Error:', error);
  });

// calculate color based on depth
function getColor(depth) {
  if (depth < 50) {
    return '#e31a1c'; // Shallow: red
  } else if (depth < 100) {
    return '#feb24c'; // Intermediate: orange
  } else {
    return '#1f78b4'; // Deep: blue
  }
}

// dd map to HTML document
map.addTo('#map');