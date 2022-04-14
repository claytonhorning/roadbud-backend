const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date },
  location: {
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    latitudeDelta: { type: Number },
    longitudeDelta: { type: Number },
  },
  nearByCity: {
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    latitudeDelta: { type: Number },
    longitudeDelta: { type: Number },
  },
  type: { type: String, default: '' },
  isCDOT: { type: Boolean, default: false },
  additionalInformation: { type: mongoose.Mixed },
  // Track Operations Data
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isDeleted: { type: Boolean, default: false },
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
