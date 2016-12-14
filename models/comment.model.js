const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,
  articleId: String
});



const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
