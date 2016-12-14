'use strict';

window.$ = (selector) => document.querySelector(selector);


const $trigger = $('.js-form-trigger');
const $form = $('.Comment-form');
const $formContent = $('.Comment-form__content');
const $submitButton = $('.submit-button');
const $commentsDiv = $('.Comments');
const $deleteTrigger = $('.js-delete-trigger');

$trigger.addEventListener('click', function (e) {
  e.preventDefault();
  $form.classList.toggle('is-hidden');
});

$submitButton.addEventListener('click', function (e) {
  e.preventDefault();
  let content = $('.Comment-form__content').value;
  let articleId = $('.js-article-id').value;
  
  let comment = { 
    commentContent: content,
    articleId: articleId
   };


  // ajax
  let request = new XMLHttpRequest();
  request.open('POST', '/articles/add-comment', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let data = JSON.parse(request.responseText);
      $formContent.value = '';
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
const articleId = $('.js-article-id').value;
let request = new XMLHttpRequest();
request.open('GET', '/comments/'+articleId);
request.setRequestHeader('Content-Type', 'application/json');
request.onload = function() {
    if (request.status === 200) {
        console.log(request.responseText);
        let comments = JSON.parse(request.responseText);
        let commentTag, deleteTrigger;
        for (var i in comments) {
          commentTag = document.createElement('p');
          commentTag.className = 'Comments__text';
          deleteTrigger = document.createElement('a');
          deleteTrigger.innerHTML = `&#10006; ${comments[i]}`;
          deleteTrigger.setAttribute('href', `/articles/delete-comment/${i}`);
          deleteTrigger.onclick = deleteComment;
          commentTag.appendChild(deleteTrigger);
          $commentsDiv.appendChild(commentTag);
          // $commentsDiv.innerHTML += `<p class="Comments__text"><a href="/articles/delete-comment/${i}" onClick="deleteComment.bind(this)" class="js-delete-trigger">&#10006;</a> ${comments[i]}</p>`;
        }
        // console.log(typeof comments);
    }
    else {
        alert('Request failed.  Returned status of ' + request.status);
    }
};
request.send();


let deleteComment = function (e) {
  e.preventDefault();
  let pathArray = this.getAttribute('href').split('/');
  const commentId = pathArray[3];
  this.parentNode.remove();
  // ajax
  let request = new XMLHttpRequest();
  request.open('POST', '/articles/delete-comment/'+commentId, true);
  // request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let data = JSON.parse(request.responseText);
      console.log(data);
    } else {
      // We reached our target server, but it returned an error
      console.log('something went wrong on the server.');
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();

};
