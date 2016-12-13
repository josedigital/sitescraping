'use strict';

const express = require('express');
const router  = express.Router();
const request = require('request');
const rp      = require('request-promise');
const cheerio = require('cheerio');
const Article = require('../models/article.model');
const Comment = require('../models/comment.model.js');
const mongoose = require('mongoose');
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
  let data = {};
  let options = {
    uri: 'https://daily.bandcamp.com/',
    transform: (body) => {
        return cheerio.load(body);
    }
  };
  
  rp(options)
    .then(($) => {
      let content = $('#content');
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

        // add articles to db if not in db
        Article.find()
          .then((articles) => {
            if(articles.length < posts.length) {
              let newArticle = new Article(data[i]);
              newArticle.save();
            }
            if( i === (posts.length - 1)) {
              res.render('articles', {data: articles});
            }
          });
        
          
      });
      
      
      
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




router.post('/articles/add-comment', function (req, res) {
  // save comment
  // find the article
  // update it with new comment 
  console.log(req.body.commentContent);
  let commentText = req.body.commentContent;
  let articleId = req.body.articleId;
  const comment = new Comment({
    content: commentText,
    articleId: articleId
  });
  comment.save();
  
  
  // res.render('_PARITIAL')
  res.json(req.body);
});




module.exports = router;
