const mongoose = require('mongoose');
const Event = require('./event.model');

const incidentSchema = new mongoose.Schema({
  type: { type: String, default: '' },
  geometry: { type: mongoose.Mixed },
  properties: { type: mongoose.Mixed },
  attributes: { type: mongoose.Mixed },
  // Track Operations Data
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

incidentSchema.pre('save', async function preSave(next) {
  const incident = this;
  const incidentProperties = this.properties;
  let location = null;
  if (incident.geometry.type === 'MultiPoint') {
    let coordinates = incident.geometry.coordinates[0];
    location = {
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  } else if (incident.geometry.type === 'Point') {
    let coordinates = incident.geometry.coordinates;
    location = {
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  }
  const event = new Event({
    name: `Incident: ${incidentProperties.type} on ${incidentProperties.routeName}`,
    description: incidentProperties.travelerInformationMessage,
    type: incidentProperties.type,
    isCDOT: true,
    location,
  });
  await event.save();
  return next();
});

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
