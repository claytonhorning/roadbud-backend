const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Directions = require("../controllers/directions.controllers");
const routeName = "directions";

router.get(`/${routeName}/:from&:to`, auth, Directions.getDirections);

module.exports = router;
