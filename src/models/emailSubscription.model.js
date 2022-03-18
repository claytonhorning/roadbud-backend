const mongoose = require('mongoose');

const emailSubscriptionSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  // Track Operations Data
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

const EmailSubscription = mongoose.model(
  'EmailSubscription',
  emailSubscriptionSchema
);
module.exports = EmailSubscription;
