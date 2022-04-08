const express = require('express');
const router = new express.Router();
const Event = require('../controllers/event.controllers');
const auth = require('../middleware/auth');
const access = require('../middleware/access');
const routeName = 'event';

router.post(`/${routeName}`, auth, access, Event.createEvent);
router.get(`/${routeName}`, auth, access, Event.getEventsList);
router.get(`/${routeName}/:_id`, auth, access, Event.getEventById);
router.patch(`/${routeName}/:_id`, auth, access, Event.updateEvent);
router.delete(`/${routeName}/:_id`, auth, access, Event.deleteEvent);

module.exports = router;
