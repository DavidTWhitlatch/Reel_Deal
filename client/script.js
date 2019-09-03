const main = async () => {
  const OMDB_BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`
  const BASE_URL = 'https://intense-cliffs-67869.herokuapp.com/favorites';
  const content = document.querySelector('.content');
  let favorites = [];

  // get favorites on page load

  const getFavorites = async () => {
    const resp = await axios(BASE_URL);
    favorites = resp.data;
  };

  // =========================
  // =   movie search view   =
  // =========================

  const makeFav = async (movie) => {
    const response = await axios.post(BASE_URL, { name: movie.Title, oid: movie.imdbID });
    favorites = response.data;
  };

  const isFavorite = (movie) => {
    let result = false;
    favorites.forEach((fav) => {
      if (fav.oid === movie.imdbID) {
        result = true;
      }
    });
    return result;
  };

  const makeMovieCard = (movie) => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
    <h3 class='movie-title'>${movie.Title}<h3>
    <div class="add-fav">
      <i class="${isFavorite(movie) ? 'fas' : 'far'} fa-heart"></i>
    </div>
    <img src='${movie.Poster !== 'N/A' ? movie.Poster : './assets/image-not-found.png'}'/>
    `;
    const heart = movieCard.querySelector('.fa-heart');
    heart.addEventListener('click', () => {
      heart.className = 'fas fa-heart';
      makeFav(movie);
    });
    return movieCard;
  };

  const searchMovie = async (userInput) => {
    const movieList = document.querySelector('.movie-list');
    movieList.innerHTML = '';
    const resp = await axios(`${OMDB_BASE_URL}s=${userInput}`);
    const wrapper = document.querySelector('.wrap');
    if (wrapper) {
      wrapper.className = 'wrap2';
    }
    if (resp.data.Search) {
      resp.data.Search.forEach((movie) => {
        const movieCard = makeMovieCard(movie);
        movieList.appendChild(movieCard);
      });
    } else {
      movieList.innerHTML = `
      <h3 class="error">No results found</h3>
      `;
    }
  };

  const searchView = () => {
    content.innerHTML = '';
    const searchForm = document.createElement('form');
    searchForm.innerHTML = `
    <div class="wrap">
      <div class="search">
        <input type="text" class="searchTerm" placeholder="Search for a movie">
        <button type="submit" class="searchButton">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </div>
    `;
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchMovie(e.target[0].value);
    });
    content.appendChild(searchForm);
    const movieList = document.createElement('div');
    movieList.className = 'movie-list';
    content.appendChild(movieList);
  };

  // ========================
  // =    favorites view    =
  // ========================

  const favoritesView = () => {
    content.innerHTML = `
    <h2 class='favorites'>Favorites</h2>
    <div class='movie-list'></div>
    `;
    const movieList = document.querySelector('.movie-list');
    favorites.forEach(async (fav) => {
      const favCard = document.createElement('div');
      favCard.className = 'movie-card';
      const resp = await axios(`${OMDB_BASE_URL}i=${fav.oid}`);
      const movieInfo = resp.data;
      favCard.innerHTML = `
      <h3 class='movie-title'>${movieInfo.Title}</h3>
      <img src='${movieInfo.Poster}' />
      `;
      movieList.appendChild(favCard);
    });
  };

  // =========================
  // =      nav buttons      =
  // =========================

  const navButtons = () => {
    const nav = document.querySelector('nav');
    nav.children[0].addEventListener('click', searchView);
    nav.children[1].addEventListener('click', favoritesView);
  };


  await getFavorites();
  searchView();
  navButtons();
};

main();
