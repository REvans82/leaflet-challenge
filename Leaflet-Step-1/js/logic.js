// Assigned url variable

var eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 13
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

  // Perform an API call to the USGS equake data.
d3.json(eqURL).then(function(data){

// Adding styles
    function createStyle(feature) {
        return {
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8,
            fillColor: createColor(feature.geometry.coordinates[2]),
            radius: createRadius(feature.properties.mag),
            opacity: 1
        }; 
    }
    function createColor(depth){
        switch (true) {
            case depth >90:
                return "#ED2939";
            case depth >70:
                return "#FC6600";
            case depth >50:
                return "#CD5C5C";  
            case depth >30:
                return "#FCD12A";   
            case depth >10:
                return "#C7EA46";   
            default:
                return "#50C878";   
        }
    }

//  Create radius
    function createRadius(magnitude) {
        return magnitude * 5;
    }
    // Create a new choropleth layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        style: createStyle,

    // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
        layer.bindPopup("magnitude: " + feature.properties.mag + "<br>depth:<br>" + feature.geometry.coordinates);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [-10, 10, 30, 50, 70, 90];
    var colors = ['#50C878', '#C7EA46', '#FCD12A', '#CD5C5C', '#FC6600', '#ED2939'];
    
    for (var i = 0; i < limits.length; i++) {
        div.innerHTML += "<i style= 'background: " + colors[i] + "'></i> "
        + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
      }
      return div;
    };

  // Adding legend to the map
  legend.addTo(myMap);

});



