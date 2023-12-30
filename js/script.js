// developers.themoviedb.org/3/getting-started/introduction
// developers.themoviedb.org/3/getting-started/request-rate-limiting
// developers.themoviedb.org/3/search
// developers.themoviedb.org/3/movies/get-movie-details
// https://www.themoviedb.org/
// We using a library called swiper swiperjs.com

// We build a router to run specific JS scripts / specific functions on specific pages
// The only thing we are doing in our JavaScript here is detecting which page we are on to add styling and make XHR requests relevant for the page we are on to get either movies or tv shows. 
// console.log(window.location.pathname);  // /11-flix-app-project/flixx-app/index.html

const global = {    // Object of the global state
    currentPage: window.location.pathname,  // To set the property of currentPage to window.location.pathname
};
console.log(global.currentPage);    


// Highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
        // /11-flix-app-project/flixx-app === /11-flix-app-project/flixx-app/
            link.classList.add('active');
        }
    });
};


const homeDirectory = '/11-flix-app-project/flixx-app/';    // To set the home directory in a const

// Init App
function init() {
    switch (global.currentPage) {   // To test the global.currentPage value
        case homeDirectory: // For the case /11-flix-app-project/flixx-app/ (index.html)
        case `${homeDirectory}index.html`:  // For the case /11-flix-app-project/flixx-app/index.html (index.html)
            console.log('Home');
            break;  // Without the brak statement the code would run further
        case `${homeDirectory}shows.html`:  // For the case /11-flix-app-project/flixx-app/shows.html (shows.html)
            console.log('Show');
            break;
        case `${homeDirectory}movie-details.html`:  // For the case /11-flix-app-project/flixx-app/movie-details.html (movie-details.html)
            console.log('Movie Details');
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
document.addEventListener('DOMContentLoaded', init);    // DOMContentLoaded runs as soon as the DOM is parsed and loaded - it calls the function init()

