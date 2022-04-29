const getClosestCity = require("../utils/closestCity");
const mongoose = require("mongoose");
const Event = require("../models/event.model");

exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    event.createdBy = req.user._id;

    const closestCity = await getClosestCity(
      req.body.location.latitude,
      req.body.location.longitude
    );

    // Set the nearby city here
    event.nearByCity = {
      longitude: closestCity.lng,
      latitude: closestCity.lat,
      name: closestCity.name,
    };

    await event.save();
    res.status(201).send(event);
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
};

exports.getEventsList = async (req, res) => {
  try {
    const eventEvents = await Event.aggregate([
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
    ]);
    return res.status(201).send(eventEvents);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.aggregate([
      // Stage 1: Filter deleted events
      {
        $match: { isDeleted: false },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params._id),
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
    ]);
    await Event.populate(event, {
      path: "createdBy",
      select: "fullName",
    });
    return res.status(200).send(event[0]);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.updateEvent = async (req, res) => {
  let updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "imageUrl", "file"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
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
    return res.status(404).send({ message: "Event does not exist!" });
  }
  try {
    event.isDeleted = true;
    await event.save();
    return res.status(200).send(event);
  } catch (e) {
    return res.status(400).send({ error: String(e) });
  }
};
