const EmailSubscription = require('../models/emailSubscription.model');

exports.createEmailSubscription = async (req, res) => {
  try {
    const emailSubscription = await EmailSubscription.findOneAndUpdate(
      req.body,
      req.body,
      {
        new: true,
        upsert: true,
      }
    );
    await emailSubscription.save();
    res.status(201).send(emailSubscription);
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
};
