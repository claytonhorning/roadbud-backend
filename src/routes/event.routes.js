const express = require('express');
const router = new express.Router();
const Event = require('../controllers/event.controllers');
const auth = require('../middleware/auth');
const routeName = 'event';

router.post(`/${routeName}`, auth, Event.createEvent);
router.get(`/${routeName}`, auth, Event.getEventsList);
router.get(`/${routeName}/:_id`, auth, Event.getEventById);
router.patch(`/${routeName}/:_id`, auth, Event.updateEvent);
router.delete(`/${routeName}/:_id`, auth, Event.deleteEvent);

module.exports = router;
