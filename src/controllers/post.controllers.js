const Post = require('../models/post.model');
const omit = require('../utils/omit');
const uploadImage = require('../utils/cloudinary/uploadImage');
const fs = require('fs');
const path = require('path');

exports.createPost = async (req, res) => {
  try {
    const postData = omit(req.body, ['file']);
    const post = new Post(postData);
    if (Object.keys(req.files).length > 0) {
      const image = req.files.file[0] || req.body.file || { path: '' };
      const uploadedImage = await uploadImage(image.path);
      post.imageUrl = uploadedImage ? uploadedImage.secure_url : '';
      if (uploadedImage) {
        let filePath = path.join(`${__dirname}/../../`, image.path);
        if (filePath.includes('uploads')) {
          fs.unlink(filePath, () => {});
        }
      }
    }
    post.createdBy = req.user._id;
    await post.save();
    res.status(201).send(post);
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
};

exports.getPostsList = async (req, res) => {
  try {
    const postPosts = await Post.find({ isDeleted: false });
    return res.status(201).send(postPosts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    return res.status(200).send(post);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.updatePost = async (req, res) => {
  let updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'imageUrl', 'file'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  const post = await Post.findById(req.params._id);
  try {
    if (Object.keys(req.files).length > 0) {
      updates.splice(updates.indexOf('file'), 1);
      const image = req.files.file[0] || req.body.file || { path: '' };
      const uploadedImage = await uploadImage(image.path);
      post.imageUrl = uploadedImage ? uploadedImage.secure_url : '';
      let filePath = path.join(`${__dirname}/../../`, image.path);
      if (filePath.includes('uploads')) {
        fs.unlink(filePath, () => {});
      }
    }
    updates.forEach((update) => (post[update] = req.body[update]));
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    res.status(400).send({ error: String(e) });
  }
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params._id);
  if (!post) {
    return res.status(404).send({ message: 'Post does not exist!' });
  }
  try {
    post.isDeleted = true;
    await post.save();
    return res.status(200).send(post);
  } catch (e) {
    return res.status(400).send({ error: String(e) });
  }
};
