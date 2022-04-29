require("dotenv").config({ path: `${__dirname}/src/config/.env` });
const axios = require("axios");

//Function that returns the polyline string from Google directions API
const getDirectionsRequest = async (to, from) => {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${process.env.GOOGLE_MAPS_KEY}`
    );
    return res;
  } catch (error) {}
};
module.exports = getDirectionsRequest;
