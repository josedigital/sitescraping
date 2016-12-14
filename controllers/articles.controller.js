'use strict';

const express = require('express');
const router  = express.Router();
const request = require('request');
const rp      = require('request-promise');
const cheerio = require('cheerio');
const Article = require('../models/article.model');
const Comment = require('../models/comment.model.js');
const mongoose = require('mongoose');
const _       = require('underscore');
// mpromise is deprecated
mongoose.Promise = global.Promise;

//---------------------- mongoose housekeeping
mongoose.connect('mongodb://localhost/bandcamp');
const db = mongoose.connection;
// check connection
db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});
// mongo success
db.once('open', function() {
	console.log('Mongoose connection.');
});




// all articles
router.get('/articles', (req, res) => {
  
  let options = {
    uri: 'https://daily.bandcamp.com/',
    transform: (body) => {
        return cheerio.load(body);
    }
  };
  
  rp(options)
    .then(($) => {
      let content = $('#content');
      let data = {};
      let articles;
      // let postText = content.children('.post').first().text();
      // data.postText = postText;
      
      let posts = content.children('.post');
      posts.each((i, elm) => {
        // save posts to data object
        data[i] = {
          title: $(elm).find('.entry-title').text(),
          link:  $(elm).find('.entry-title a').attr('href'),
          contentHTML: $(elm).find('.entry-content').html(),
          contentText: $(elm).find('.entry-content').text(),
          img: $(elm).find('.entry-content').find('img').first().attr('src')
        }
     
      });

      _.forEach(data, function (article) {
        let newArticle = new Article(article);
        newArticle.save();
      });

      Article.find()
        .then((articles) => {
          res.render('articles', {data: articles});
        });
      
      // console.log(data);
      
      
      
    })
    .catch((err) => {
      console.log(err);
    });

    
});



router.get('/articles/:slug', (req, res) => {
  const slug = req.params.slug;
  Article.findOne({ slug })
    .then((article) => {
      res.render('article', { data: article });
    }); 
});

router.get('/comments/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  let commentObj = {};
  Comment.find({ articleId: articleId })
    .then((comment) => {
      comment.map(function (commentObject) {
        console.log(commentObject.content);
        commentObj[commentObject._id] = commentObject.content;
      });
      res.json(commentObj);
    });
});


router.post('/articles/add-comment', function (req, res) {
  let commentText = req.body.commentContent;
  let articleId = req.body.articleId;

  let comment = new Comment({
    content: commentText,
    articleId: articleId
  });
  var newComment = new Comment(comment);
  newComment.save(function (err, comment) {
    if(err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate({'_id': articleId},{$push: {'comments':comment}},{new: true })
          .exec(function(err, doc) {
            if (err) {
              console.log(err);
            } else {
              Comment.findOne({ _id: comment._id })
              .then((comm) => {
                res.json(comm);
              })
              
            }
          });
    }
  })
  
  // res.render('_PARITIAL')
  
});





router.post('/articles/delete-comment/:commentId', function (req, res) {
  const commentId = req.params.commentId
  Comment.remove({ '_id': commentId })
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
      console.log(doc);
		}
	});
});



module.exports = router;
