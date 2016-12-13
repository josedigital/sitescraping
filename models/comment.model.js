const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,
  articlId: String
});



const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
