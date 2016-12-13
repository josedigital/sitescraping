window.$ = (selector) => document.querySelector(selector);


let trigger = $('.js-form-trigger');
let form = $('.Comment-form');
let submitButton = $('.submit-button');

trigger.addEventListener('click', function (e) {
  e.preventDefault();
  form.classList.toggle('is-hidden');
});

submitButton.addEventListener('click', function (e) {
  e.preventDefault();
  let content = $('.Comment-form__content').value;
  let articleId = $('.js-article-id');
  
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
      console.log(data);
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





