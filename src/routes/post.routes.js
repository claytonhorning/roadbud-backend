const express = require('express');
const router = new express.Router();
const Post = require('../controllers/post.controllers');
const auth = require('../middleware/auth');
const access = require('../middleware/access');
const routeName = 'post';

router.post(`/${routeName}`, auth, access, Post.createPost);
router.get(`/${routeName}`, auth, access, Post.getPostsList);
router.get(`/${routeName}/:_id`, auth, access, Post.getPostById);
router.patch(`/${routeName}/:_id`, auth, access, Post.updatePost);
router.delete(`/${routeName}/:_id`, auth, access, Post.deletePost);

module.exports = router;
