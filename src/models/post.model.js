const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  // Track Operations Data
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isDeleted: { type: Boolean, default: false },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
