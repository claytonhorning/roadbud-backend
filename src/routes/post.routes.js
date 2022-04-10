const express = require('express');
const router = new express.Router();
const Post = require('../controllers/post.controllers');
const auth = require('../middleware/auth');
const routeName = 'post';

router.post(`/${routeName}`, auth, Post.createPost);
router.get(`/${routeName}`, auth, Post.getPostsList);
router.get(`/${routeName}/:_id`, auth, Post.getPostById);
router.patch(`/${routeName}/:_id`, auth, Post.updatePost);
router.delete(`/${routeName}/:_id`, auth, Post.deletePost);

module.exports = router;
