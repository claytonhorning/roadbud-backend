const User = require('../models/user.model');

exports.getUsersList = async (req, res) => {
  try {
    const conditions = req.user.role === 'admin' ? {} : { isDeleted: false };
    const users = await User.find(conditions).select(
      'fullName email role createdAt isDeleted'
    );
    res.status(201).send(users);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'fullName', 'password'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  const user = await User.findById(req.params._id);
  try {
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).send({ message: 'Action completed successfully!' });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.updateUserStatus = async (req, res) => {
  const user = await User.findById(req.params._id);
  try {
    if (user.isDeleted) {
      user.isDeleted = false;
    } else {
      user.isDeleted = true;
    }
    await user.save();
    res.status(200).send({ message: 'Action completed successfully!' });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) {
    return res.status(404).send({ message: 'User does not exist!' });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params._id);
    // TODO Remove User Actions History
    return res.status(200).send(deletedUser);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.reActivateUserAccount = async (req, res) => {
  const user = await User.findById(req.params._id);
  try {
    user.isDeleted = false;
    await user.save();
    res.status(200).send({ message: 'Action completed successfully!' });
  } catch (e) {
    res.status(400).send(e);
  }
};
