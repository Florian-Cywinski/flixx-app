// developers.themoviedb.org/3/getting-started/introduction
// developers.themoviedb.org/3/getting-started/request-rate-limiting
// developers.themoviedb.org/3/search
// developers.themoviedb.org/3/movies/get-movie-details
// https://www.themoviedb.org/
// We using a library called swiper swiperjs.com


// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = '123456789';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    hideSpinner();

    return data;
};


// Display 20 most popular movies
async function displayPopularMovies() { // https://developer.themoviedb.org/reference/movie-popular-list - to see all get options click on Response on this page
    const {results} = await fetchAPIData('movie/popular');      // {} to destrcture the object we fetch to get the straight the array of the 20 most popular movies as object  

    // To create a div / card for every movie and put it to the DOM
    // results.slice(0, 5).forEach(movie => {    // To show the first 5 movies of the first 20 movies
    // results.slice(-5).forEach(movie => {    // To show the last 5 movies of the first 20 movies
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            ${  // We use the ternary-operator - if there is an image for this movie : if there isn't an image for this movie
                movie.poster_path
                    ? `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                  />`
                    : `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                  />`
            }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>`;


        document.getElementById('popular-movies').appendChild(div);
    })
}


// Display 20 most popular tv shows         
async function displayPopularShows() { // https://developer.themoviedb.org/reference/tv-series-popular-list - to see all get options click on Response on this page
    const {results} = await fetchAPIData('tv/popular');      // {} to destrcture the object we fetch to get the straight the array of the 20 most popular movies as object  

    // To create a div / card for every tv show and put it to the DOM
    // results.slice(0, 5).forEach(show => {    // To show the first 5 shows of the first 20 shows
    // results.slice(-5).forEach(show => {    // To show the last 5 shows of the first 20 movies
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
            ${  // We use the ternary-operator - if there is an image for this show : if there isn't an image for this show
                show.poster_path
                    ? `<img
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                  />`
                    : `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                  />`
            }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Air Data: ${show.first_air_date}</small>
          </p>
        </div>`;


        document.getElementById('popular-shows').appendChild(div);
    })
}


// Display Movie Details
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1]; // To get the query string (everything from the ?) - window.location.search => ?id=848326 - ...split('=') => Array [ "?id", "848326" ] - [1] is the ID we need

    const movie = await fetchAPIData(`movie/${movieId}`);

    const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
    <div>
    ${  // We use the ternary-operator - if there is an image for this movie : if there isn't an image for this movie
        movie.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
            : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
        ${movie.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
    </div>
  </div>`;

  document.getElementById('movie-details').appendChild(div);
}


// To show / hide the spinner
function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
};
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
};


// To add commas to the budget value
function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');    // This is called regular expression - Brad copied it from the internet - to add a comma after every three ziros
}


// Page Router
// We build a router to run specific JS scripts / specific functions on specific pages
// The only thing we are doing in our JavaScript here is detecting which page we are on to add styling and make XHR requests relevant for the page we are on to get either movies or tv shows. 

const global = {    // Object of the global state
    currentPage: window.location.pathname,  // To set the property of currentPage to window.location.pathname
};
console.log(global.currentPage);

const homeDirectory = '/11-flix-app-project/flixx-app/';    // To set the home directory in a const

// Init App
function init() {
    switch (global.currentPage) {   // To test the global.currentPage value
        case homeDirectory: // For the case /11-flix-app-project/flixx-app/ (index.html)
        case `${homeDirectory}index.html`:  // For the case /11-flix-app-project/flixx-app/index.html (index.html)
            console.log('Home');
            displayPopularMovies();
            break;  // Without the brak statement the code would run further
        case `${homeDirectory}shows.html`:  // For the case /11-flix-app-project/flixx-app/shows.html (shows.html)
            console.log('Show');
            displayPopularShows();
            break;
        case `${homeDirectory}movie-details.html`:  // For the case /11-flix-app-project/flixx-app/movie-details.html (movie-details.html)
            console.log('Movie Details');
            displayMovieDetails();
            break;
        case `${homeDirectory}tv-details.html`:  // For the case /11-flix-app-project/flixx-app/tv-details.html (tv-details.html)
            console.log('TV Details');
            break;
        case `${homeDirectory}search.html`:  // For the case /11-flix-app-project/flixx-app/search.html (search.html)
            console.log('Search Page');
            break;
    }

    highlightActiveLink();
};


// Active Link
// Highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
        // /11-flix-app-project/flixx-app === /11-flix-app-project/flixx-app/
            link.classList.add('active');
        // } else if (link.getAttribute('href') === global.currentPage.substr(0, global.currentPage.length-10)) {  // For the case global.currentPage = /11-flix-app-project/flixx-app/index.html
        } else if (global.currentPage.includes('index.html') && link.getAttribute('href') === '/11-flix-app-project/flixx-app/') {  // For the case global.currentPage = /11-flix-app-project/flixx-app/index.html
            link.classList.add('active');
        }
    });
};


document.addEventListener('DOMContentLoaded', init);    // DOMContentLoaded runs as soon as the DOM is parsed and loaded - it calls the function init()