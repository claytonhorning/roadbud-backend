const getDirectionsRequest = require("../utils/getDirectionsRequest");
const getDirectionsPolyline = require("../utils/getDirectionsPolyline");
const getEventsAlongPath = require("../utils/getEventsAlongPath");

exports.getDirections = async (req, res) => {
  try {
    let directions = {
      polyline: [],
      events: [],
    };

    // Take to and from params and decode the polyline. Then save it to the object
    await getDirectionsRequest(req.params.from, req.params.to)
      .then(async (res) => {
        const polylineString = res.data.routes[0].overview_polyline.points;
        directions.polyline = getDirectionsPolyline(polylineString);
      })
      .catch((err) => {
        console.log("Error with creating the polyline" + err);
      });

    directions.events = await getEventsAlongPath(directions.polyline);

    res.status(201).send(directions);
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
};
