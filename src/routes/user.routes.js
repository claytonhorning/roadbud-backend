const express = require('express');
const router = new express.Router();
const User = require('../controllers/user.controllers');
const auth = require('../middleware/auth');
const access = require('../middleware/access');

router.get(
  '/user',
  auth,
  (req, res, next) => access(req, res, next, 'USER'),
  User.getUsersList
);
router.patch(
  '/user/:_id',
  auth,
  (req, res, next) => access(req, res, next, 'USER'),
  User.updateUser
);
router.patch(
  '/user/updateUserStatus/:_id',
  auth,
  (req, res, next) => access(req, res, next, 'USER'),
  User.updateUserStatus
);
router.delete(
  '/user/:_id',
  auth,
  (req, res, next) => access(req, res, next, 'USER'),
  User.deleteUser
);
router.patch(
  '/user/activate/:_id',
  auth,
  (req, res, next) => access(req, res, next, 'USER'),
  User.reActivateUserAccount
);

module.exports = router;
