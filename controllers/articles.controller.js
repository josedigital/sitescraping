'use strict';

const express = require('express');
const router  = express.Router();
const request = require('request');
const rp      = require('request-promise');
const cheerio = require('cheerio');
const Article = require('../models/article.model');
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
        // console.log($(this).find('.entry-title').text());
        data[i] = {
          title: $(elm).find('.entry-title').text(),
          link:  $(elm).find('.entry-title a').attr('href'),
          contentHTML: $(elm).find('.entry-content').html(),
          contentText: $(elm).find('.entry-content').text(),
          img: $(elm).find('.entry-content').find('img').first().attr('src')
        }

        // add articles to db if not in db
        if ( !Article.findOne({ title: data[i].slug }) ) {
          let newArticle = new Article(data[i]);
          newArticle.save();
        }
          
      });
      Article.find()
      .then((articles) => {
        console.log(articles);
        res.render('articles', {data: articles});
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







module.exports = router;
