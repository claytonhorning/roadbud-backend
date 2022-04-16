const express = require('express');

const router = new express.Router();
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Post = require('../models/post.model');
const auth = require('../middleware/auth');
const _ = require('lodash');

// Create user account
router.post('/auth/', async (req, res) => {
  try {
    const userIsExist = (await User.exists({ email: req.body.email })) || null;
    if (userIsExist) {
      return res.status(409).send({ error: 'User is already registered' });
    }

    const user = new User({
      ...req.body,
    });

    await user.save();
    const token = await user.generateAuthToken();

    res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .status(201)
      .send({ token });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user.isDeleted) {
      return res.status(400).send({ error: 'Account is Deactivated' });
    }
    const token = await user.generateAuthToken();
    res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .status(200)
      .send({ token });
  } catch (e) {
    res.status(e.code || 400).send({ error: e.message });
  }
});

router.post('/auth/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

// Logout from all devices
router.post('/auth/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

// Read connected user
router.get('/auth/me', auth, async (req, res) => {
  try {
    let me = _.pick(req.user, [
      'email',
      'fullName',
      'role',
      'createdAt',
      'settings',
    ]);
    const userEvents = await Event.aggregate([
      // Stage 1: Filter deleted events
      {
        $match: { isDeleted: false },
      },
      // Stage 2: Select connected user events
      {
        $match: {
          createdBy: req.user._id,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'event',
          as: 'posts',
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    const userPosts = await Post.aggregate([
      // Stage 1: Filter deleted events
      {
        $match: { isDeleted: false },
      },
      // Stage 2: Select connected user events
      {
        $match: {
          createdBy: req.user._id,
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    const response = {
      ...me,
      events: userEvents,
      posts: userPosts,
    };
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send();
  }
});

// Update connected user
router.patch('/auth/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'fullName', 'password', 'settings'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    const token = await req.user.generateAuthToken();
    res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .status(200)
      .send({ token });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
