const polyline = require("@mapbox/polyline");

const getDirectionsPolyline = (encondedPolyline) => {
  const polylineArray = polyline.decode(encondedPolyline);

  let directionsPolyline = polylineArray.map((point) => ({
    latitude: point[0],
    longitude: point[1],
  }));

  return directionsPolyline;
};

module.exports = getDirectionsPolyline;
