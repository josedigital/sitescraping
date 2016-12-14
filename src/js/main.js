'use strict';

window.$ = (selector) => document.querySelector(selector);


const trigger = $('.js-form-trigger');
const form = $('.Comment-form');
const formContent = $('.Comment-form__content');
const submitButton = $('.submit-button');
const commentsDiv = $('.Comments');

trigger.addEventListener('click', function (e) {
  e.preventDefault();
  form.classList.toggle('is-hidden');
});

submitButton.addEventListener('click', function (e) {
  e.preventDefault();
  let content = $('.Comment-form__content').value;
  let articleId = $('.js-article-id').value;
  
  let comment = { 
    commentContent: content,
    articleId: articleId
   };


  // ajax
  var request = new XMLHttpRequest();
  request.open('POST', '/articles/add-comment', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      formContent.value = '';
      $('.Comments').innerHTML += data.content;
    } else {
      // We reached our target server, but it returned an error
      console.log('something went wrong on the server.');
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send(JSON.stringify(comment));

});





// let pathArray = window.location.pathname.split( '/' );
// const slug = pathArray[2];
let articleId = $('.js-article-id').value;
var request = new XMLHttpRequest();
request.open('GET', '/comments/'+articleId);
request.setRequestHeader('Content-Type', 'application/json');
request.onload = function() {
    if (request.status === 200) {
        console.log(request.responseText);
        let comments = JSON.parse(request.responseText);
        for (var i in comments) {
          commentsDiv.innerHTML += '<p>' + comments[i] + '</p>';
        }
        // console.log(typeof comments);
    }
    else {
        alert('Request failed.  Returned status of ' + request.status);
    }
};
request.send();


