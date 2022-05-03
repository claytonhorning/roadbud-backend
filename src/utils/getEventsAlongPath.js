const Event = require("../models/event.model");
const { PolyUtil } = require("node-geometry-library");

const getEventsAlongPath = async (polyline) => {
  let events = [];

  for await (const doc of Event.aggregate([
    // Stage 1: Filter deleted events
    {
      $match: { isDeleted: false },
    },
    // Stage 2: Select events from last 24 hours
    {
      $match: {
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "event",
        as: "posts",
      },
    },
    {
      $sort: { _id: -1 },
    },
  ])) {
    let formattedPolyline = polyline.map((location) => ({
      lat: location?.latitude,
      lng: location?.longitude,
    }));

    // Change first param to doc.location and second param to the polyline passed in
    let isNearPolyline = PolyUtil.isLocationOnEdge(
      { lat: doc.location?.latitude, lng: doc.location?.longitude },
      formattedPolyline,
      2000 // Tolerance
    );

    if (isNearPolyline) {
      events.push(doc);
    }
  }

  return events;
};

module.exports = getEventsAlongPath;
