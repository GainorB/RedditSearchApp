import api from './api';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', e => {
  // prevents form from submitting
  e.preventDefault();

  // get search term
  const searchTerm = searchInput.value;
  // get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // get limit
  const searchLimit = document.getElementById('limit').value;

  //clear input
  searchInput.value = '';

  // Search Reddit
  searchTerm !== ''
    ? api.search(searchTerm, searchLimit, sortBy).then(results => {
        let output = `<div class="card-columns">`;
        results.forEach(post => {
          // check for image
          const image = post.preview
            ? post.preview.images[0].source.url
            : 'https://applets.imgix.net/https%3A%2F%2Fassets.ifttt.com%2Fimages%2Fchannels%2F1352860597%2Ficons%2Fon_color_large.png%3Fversion%3D0?ixlib=rails-2.1.3&w=240&h=240&auto=compress&s=14be39acc55fbe4638b776011273dfd5';

          output += `
          <div class="card">
            <img class="card-img-top" src="${image}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${truncate(post.selftext, 100)}</p>
              <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
              <hr>
              <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
              <span class="badge badge-dark">Score: ${post.score}</span>
            </div>
        </div>
          `;
        });
        output += `</div>`;
        document.getElementById('results').innerHTML = output;
      })
    : showMessage('Please add a search term', 'alert-danger');
});

function showMessage(message, className) {
  // create div
  const div = document.createElement('div');
  // add class
  div.className = `alert ${className}`;
  // add text
  div.appendChild(document.createTextNode(message));
  // get parent container
  const searchContainer = document.getElementById('search-container');
  // get search
  const search = document.getElementById('search');
  // insert message
  searchContainer.insertBefore(div, search);
  // timeout
  setTimeout(() => {
    div.remove();
    // document.querySelector('.alert').remove();
  }, 3000);
}

function truncate(text, limit) {
  const shortened = text.indexOf(' ', limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
}
