const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: { type: String, default: '' },
  geometry: { type: mongoose.Mixed },
  properties: { type: mongoose.Mixed },
  attributes: { type: mongoose.Mixed },
  // Track Operations Data
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
