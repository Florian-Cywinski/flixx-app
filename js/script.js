// developers.themoviedb.org/3/getting-started/introduction
// developers.themoviedb.org/3/getting-started/request-rate-limiting
// developers.themoviedb.org/3/search
// developers.themoviedb.org/3/movies/get-movie-details
// https://www.themoviedb.org/
// We using a library called swiper swiperjs.com - for the swiper slider


const global = {    // Object of the global state
  currentPage: window.location.pathname,  // To set the property of currentPage to window.location.pathname

  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1
  },

  api: {
    apiKey: '123456789',
    apiUrl: 'https://api.themoviedb.org/3/'
  }
};


// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();

    hideSpinner();

    return data;
};


// Make request to search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`);
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
    console.log(movie);  // To see all the data we can work with

    // Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);  // 'movie' is the type

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


// Display TV-Show Details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1]; // To get the query string (everything from the ?) - window.location.search => ?id=848326 - ...split('=') => Array [ "?id", "848326" ] - [1] is the ID we need

  const show = await fetchAPIData(`tv/${showId}`);
  console.log(show);  // To see all the data we can work with

  // Overlay for background image
  displayBackgroundImage('tv', show.backdrop_path);  // 'tv' is the type

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
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
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
    <li><span class="text-secondary">Last Episode to Air:</span> ${show.last_episode_to_air.name}</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
      ${show.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
  </div>
</div>`;

document.getElementById('show-details').appendChild(div);
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


// Display Backdrop On Details Pages (movies and shows)
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1'; // To be sure it's behind the content
  overlayDiv.style.opacity = '0.1'; // To be faded

  // To check the type (movie or show)
  if (type === 'movie') {
    document.getElementById('movie-details').appendChild(overlayDiv);
  } else {
    document.getElementById('show-details').appendChild(overlayDiv);
  }
}


// Display Slider Movies
async function displaySlider() {
  const {results} = await fetchAPIData('movie/now_playing');  // {} - to destructure - this way we get the array called results from the fetched object

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
  </h4>`;

  document.querySelector('.swiper-wrapper').appendChild(div);

  initSwiper(); // To init a couple of options

  })
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {  // new Swiper is an object - we put in a class of swiper - for the options we pass in an object - all the options you can see at swiperjs.com/swiper-api
    slidesPerView: 1, // we set it to 1 that we can specify breakpoints as well - for 500px (width) and up we set it to two - if it is 700px and up we set it to three - if it is 1200px and up we set it to four
    spaceBetween: 30,
    freeMode: true, // to click and drag it by ourself
    loop: true, // because we (don't) want it to stop at the end
    autoplay: {
      delay: 4000,  // to show a slide for 4 sec
      disableOnInteraction: false  // when you hover over it it stops
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  })
}


// Search Movies / Shows
async function search() {
  const queryString = window.location.search; // ?type=movie&search-term=
  const urlParams = new URLSearchParams(queryString); // URLSearchParams { type → "movie", "search-term" → "" }

  global.search.type = urlParams.get('type'); // To set the type (movie or tv (show))
  global.search.term = urlParams.get('search-term'); // To set the type (movie or tv (show)) - search-term comes from the search-form - see search.html

  if (global.search.term !== '' && global.search.term !== null) {
    const {results, total_pages, page} = await searchAPIData(); // results is an array of the first 20 results if 20 or more exists, total_pages is the number of result pages e.g. for the input 'orphan' ther are 10 pages, page is the current page e.g. 1

    // To make sure whether there are results
    if (results.length === 0) {
      showAlert('No results founf');
      return;      
    }

    displaySearchResults(results);  // To show the results on the DOM

    document.getElementById('search-term').value = '';  // To clear the input field
    
  } else {
    // alert('Please enter a search term');  // The default JS alert
    showAlert('Please enter a search term', 'alert-error');  // The customized alert
  }

}

function displaySearchResults(results) {
    // To create a div / card for every movie and put it to the DOM
    // results.slice(0, 5).forEach(movie => {    // To show the first 5 movies of the first 20 movies
    // results.slice(-5).forEach(movie => {    // To show the last 5 movies of the first 20 movies
    results.forEach(result => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
          ${  // We use the ternary-operator - if there is an image for this result : if there isn't an image for this result
              result.poster_path
                  ? `<img
                  src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                  class="card-img-top"
                  alt="${global.search.type === 'movie' ? result.title : result.name}"
                />`
                  : `<img
                  src="images/no-image.jpg"
                  class="card-img-top"
                  alt="${global.search.type === 'movie' ? result.title : result.name}"
                />`
          }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>
      </div>`;


      document.getElementById('search-results').appendChild(div);
  })  
}

// Show alert
function showAlert(message, className = 'alert-error') {  // 'alert-error' is the default class for className
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);  // To add the classes alert and className
  alertEl.appendChild(document.createTextNode(message));
  document.getElementById('alert').appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
}


// Page Router
// We build a router to run specific JS scripts / specific functions on specific pages
// The only thing we are doing in our JavaScript here is detecting which page we are on to add styling and make XHR requests relevant for the page we are on to get either movies or tv shows. 
const homeDirectory = '/11-flix-app-project/flixx-app/';    // To set the home directory in a const

// Init App
function init() {
    switch (global.currentPage) {   // To test the global.currentPage value
        case homeDirectory: // For the case /11-flix-app-project/flixx-app/ (index.html)
        case `${homeDirectory}index.html`:  // For the case /11-flix-app-project/flixx-app/index.html (index.html)
            displaySlider();
            displayPopularMovies();
            break;  // Without the brak statement the code would run further
        case `${homeDirectory}shows.html`:  // For the case /11-flix-app-project/flixx-app/shows.html (shows.html)
            displayPopularShows();
            break;
        case `${homeDirectory}movie-details.html`:  // For the case /11-flix-app-project/flixx-app/movie-details.html (movie-details.html)
            displayMovieDetails();
            break;
        case `${homeDirectory}tv-details.html`:  // For the case /11-flix-app-project/flixx-app/tv-details.html (tv-details.html)
            displayShowDetails();
            break;
        case `${homeDirectory}search.html`:  // For the case /11-flix-app-project/flixx-app/search.html (search.html)
            console.log('Search Page');
            search();
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