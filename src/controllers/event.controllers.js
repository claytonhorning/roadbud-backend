const Event = require('../models/event.model');
const omit = require('../utils/omit');
const uploadImage = require('../utils/cloudinary/uploadImage');
const fs = require('fs');
const path = require('path');

exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    event.createdBy = req.user._id;
    await event.save();
    res.status(201).send(event);
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
};

exports.getEventsList = async (req, res) => {
  try {
    const eventEvents = await Event.find({ isDeleted: false });
    return res.status(201).send(eventEvents);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params._id);
    return res.status(200).send(event);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.updateEvent = async (req, res) => {
  let updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'imageUrl', 'file'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  const event = await Event.findById(req.params._id);
  try {
    updates.forEach((update) => (event[update] = req.body[update]));
    await event.save();
    res.status(200).send(event);
  } catch (e) {
    res.status(400).send({ error: String(e) });
  }
};

exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params._id);
  if (!event) {
    return res.status(404).send({ message: 'Event does not exist!' });
  }
  try {
    event.isDeleted = true;
    await event.save();
    return res.status(200).send(event);
  } catch (e) {
    return res.status(400).send({ error: String(e) });
  }
};
