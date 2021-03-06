const mongoose = require("mongoose");
const Event = require("./event.model");
const Post = require("./post.model");
const getClosestCity = require("../utils/closestCity");

const incidentSchema = new mongoose.Schema({
  type: { type: String, default: "" },
  geometry: { type: mongoose.Mixed },
  properties: { type: mongoose.Mixed },
  attributes: { type: mongoose.Mixed },
  // Track Operations Data
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

incidentSchema.pre("save", async function preSave(next) {
  const incident = this;
  const incidentProperties = this.properties;
  let location = null;
  if (incident.geometry.type === "MultiPoint") {
    let coordinates = incident.geometry.coordinates[0];
    location = {
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  } else if (incident.geometry.type === "Point") {
    let coordinates = incident.geometry.coordinates;
    location = {
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  }

  const closestCity = await getClosestCity(
    location?.latitude,
    location?.longitude
  );

  // Set the nearby city here

  const event = new Event({
    name: `${incidentProperties.type} on ${incidentProperties.routeName}`,
    type: incidentProperties.type,
    isCDOT: true,
    location,
    nearByCity: {
      longitude: closestCity.lng,
      latitude: closestCity.lat,
      name: closestCity.name,
    },
    incident: this._id,
  });

  await event.save().then(async (event) => {
    const post = new Post({
      description: incidentProperties.travelerInformationMessage,
      event: event._id,
    });
    await post.save();
  });
  return next();
});

const Incident = mongoose.model("Incident", incidentSchema);
module.exports = Incident;
