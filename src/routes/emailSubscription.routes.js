const express = require("express");
const router = new express.Router();
const EmailSubscriptionController = require("../controllers/emailSubscription.controllers");

router.post(
  "/emailSubscription",
  EmailSubscriptionController.createEmailSubscription
);

module.exports = router;
