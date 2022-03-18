const EmailSubscription = require('../models/emailSubscription.model');

exports.createEmailSubscription = async (req, res) => {
  try {
    const emailSubscription = new EmailSubscription(req.body);
    await emailSubscription.save();
    res.status(201).send(emailSubscription);
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
};
