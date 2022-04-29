const mongoose = require("mongoose");
const Event = require("../models/event.model");
const { PolyUtil } = require("node-geometry-library");

const getEventsAlongPath = async (polyline) => {
  let events = [];

  for await (const doc of Event.find()) {
    let formattedPolyline = polyline.map((location) => ({
      lat: location?.latitude,
      lng: location?.longitude,
    }));

    console.log("" + formattedPolyline);
    console.log({ lat: doc.location?.latitude, lng: doc.location?.longitude });

    // Change first param to doc.location and second param to the polyline passed in
    let isNearPolyline = PolyUtil.isLocationOnEdge(
      { lat: doc.location?.latitude, lng: doc.location?.longitude },
      formattedPolyline,
      2000
      // Tolerance
    );

    if (isNearPolyline) {
      events.push(doc);
    }
  }

  return events;
};

module.exports = getEventsAlongPath;
