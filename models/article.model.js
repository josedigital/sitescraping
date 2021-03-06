const mongoose = require('mongoose');
const CommentSchema = require('./comment.model');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    index: true
  },
  slug: {
    type: String
  },
  link: {
    type: String
  },
  contentHTML: String,
  contentText: String,
  img: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

// middleware - creates article slug
ArticleSchema.pre('save', function (next) {
  this.slug = makeSlug(this.title);
  next();
});

function makeSlug(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;
