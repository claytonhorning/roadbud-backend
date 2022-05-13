const axios = require("axios");

const getClosestCity = async (lat, lon) => {
  let closestCity = {};

  try {
    const res = await axios.get(
      `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&username=clayton`
    );
    closestCity = res.data.geonames[0];
  } catch (error) {
    console.log(error);
  }

  return closestCity;
};

module.exports = getClosestCity;
