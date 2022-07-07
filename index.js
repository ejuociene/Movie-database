const movieContainer = document.querySelector('.movie');
const logo = document.querySelector('.logo_img');
const watchlistShortcut = document.querySelector('.watchlist__shortcut');
const watchlistShortcutText = document.querySelector('.watchlist__shortcut__text');
const watchlistShortcutCount = document.querySelector('.watchlist__shortcut__count');
const pageNav = document.querySelector('.pageNav');
const pageList = document.querySelector('.pagination');
const loader = document.querySelector('.loader');
const searchInput = document.querySelector('#search');
const searchBtn = document.querySelector('.search_img');
const searchError = document.querySelector('.searcherror__msg');
const arrowSearchBtn = document.querySelector('.intro__subheader');
const introPage = document.querySelector('.intro');
const moviePage = document.querySelector('.mpage');
const moviePageTitle = document.querySelector('.mpage__title');
const moviePageType = document.querySelector('.mpage__type');
const moviePageReleaseYear = document.querySelector('.mpage__released');
const moviePageRating = document.querySelector('.mpage__rating__num');
const moviePageImage = document.querySelector('.mpage__movie__image');
const moviePageGenres = document.querySelector('.mpage__genre__container');
const moviePagePlot = document.querySelector('.mpage__plot');
const moviePageCreator = document.querySelector('.mpage__creator__name');
const moviePageWriter = document.querySelector('.mpage__writer__name');
const moviePageActors = document.querySelector('.mpage__actors__names');
const moviePageWishlistBtn = document.querySelector('.mpage__wishlist__btn');
const mpageAddSign = document.querySelector('.mpage__add');
const moviePageBack = document.querySelector('.mpage__back');
const watchlistBack = document.querySelector('.watchlist__back');
const watchlistPage = document.querySelector('.watchlist');
const watchlistContainer = document.querySelector('.watchlist__container');
const watchlistEmpty = document.querySelector('.watchlist__empty');
const watchlistCountDisplay = document.querySelector('.watchlist__header__count');
const spinner = document.querySelector('.lds-spinner');
const error = document.querySelector('.error__msg');

let currentPage = 1;
searchValue = 'welcome';
isIntro = true;
isWatchlist = false;
let movie = '';
let watchlistIDs = [];
let watchlistCount = 0;
let moviePageID = '';

const createElement = (el) => {
	return document.createElement(el);
};

const stringToArray = (str) => {
	let newString = [];
	newString = str.split(', ');
	return newString;
};

const getMovies = async (currentPage, searchValue) => {
	movieContainer.innerHTML = '';
	pageList.innerHTML = '';
	movieContainer.classList.remove('hidden');
	moviePage.classList.add('hidden');
	pageNav.classList.remove('hidden');
	try {
		searchError.classList.add('hidden');
		spinner.classList.remove('hidden');
		const resp = await fetch(`https://www.omdbapi.com/?apikey=86c15441&s=${searchValue}&page=${currentPage}`);
		const result = await resp.json();
		spinner.classList.add('hidden');
		console.log(result);
		pagination(result.totalResults, currentPage);
		result.Search.map((data) => {
			createCard(data.Poster, data.Title, data.Type, data.imdbID);
		});
	} catch (error) {
		searchError.classList.remove('hidden');
		pageNav.classList.add('hidden');
	}
};

const getMovieInfo = async (imdbID) => {
	try {
		spinner.classList.remove('hidden');
		const resp = await fetch(`https://www.omdbapi.com/?apikey=86c15441&i=${imdbID}`);
		const result = await resp.json();
		spinner.classList.add('hidden');
		moviePageID = imdbID;
		displayMoviePage(
			result.Title,
			result.Type,
			result.Year,
			result.imdbRating,
			result.Poster,
			stringToArray(result.Genre),
			result.Plot,
			result.Director,
			result.Writer,
			result.Actors
		);
	} catch (error) {
		loadError();
	}
};

const createCard = (imageUrl, name, type, ID) => {
	const card = createElement('div');
	card.classList.add('movie__card');
	const movieImage = createElement('img');
	movieImage.addEventListener('click', () => {
		getMovieInfo(ID);
	});
	movieImage.classList.add('movie__image');
	movieImage.setAttribute('src', imageUrl);
	movieImage.setAttribute('alt', name);
	const movieInfo = createElement('div');
	movieInfo.classList.add('movie__info');
	const movieTitle = createElement('h1');
	movieTitle.classList.add('movie__title');
	movieTitle.innerHTML = name;
	const movieType = createElement('h2');
	movieType.classList.add('type');
	movieType.innerHTML = `Type: ${type}`;
	const watchlistContainer = createElement('div');
	watchlistContainer.classList.add('watchlist_container');
	watchlistContainer.addEventListener('click', () => {
		addToWatchlist(ID);
		wishlistSign(ID, addSign);
	});
	const addSign = createElement('div');
	addSign.classList.add('add_sign');
	wishlistSign(ID, addSign);
	const addtoWatchlist = createElement('div');
	addtoWatchlist.classList.add('add_to_watchlist');
	addtoWatchlist.innerHTML = 'Watchlist';
	const moreInfo = createElement('div');
	moreInfo.classList.add('moreinfo');
	moreInfo.addEventListener('click', () => {
		getMovieInfo(ID);
	});
	const moreInfoImg = createElement('img');
	moreInfoImg.classList.add('moreinfo__img');
	moreInfoImg.setAttribute('src', './assets/info.svg');
	moreInfo.append(moreInfoImg);
	watchlistContainer.append(addSign, addtoWatchlist);
	movieInfo.append(movieTitle, movieType, watchlistContainer, moreInfo);
	card.append(movieImage, movieInfo);
	movieContainer.append(card);
};

const pagination = (total, currentPage, perpage = 10) => {
	const totalPages = Math.ceil(total / perpage);
	let disabledFirst = currentPage === 1 ? 'disabled' : 'active';
	let disabledLast = currentPage === totalPages ? 'disabled' : 'active';
	const previousPage = createElement('li');
	previousPage.classList.add('previous_page', disabledFirst);
	previousPage.innerHTML = 'Previous';
	const nextPage = createElement('li');
	nextPage.classList.add('next_page', disabledLast);
	nextPage.innerHTML = 'Next';
	pageList.append(previousPage, nextPage);
};

const displayMoviePage = (title, type, released, rating, image, genres, plot, creator, writer, actors) => {
	moviePageGenres.innerHTML = '';
	movieContainer.classList.add('hidden');
	watchlistPage.classList.add('hidden');
	pageNav.classList.add('hidden');
	introPage.classList.add('hidden');
	moviePage.classList.remove('hidden');
	moviePageTitle.innerHTML = title;
	moviePageType.innerHTML = type;
	moviePageReleaseYear.innerHTML = released;
	moviePageRating.innerHTML = rating;
	moviePageImage.setAttribute('src', image);
	for (let i = 0; i < genres.length; i++) {
		createGenre(genres[i]);
	}
	moviePagePlot.innerHTML = plot;
	moviePageCreator.innerHTML = creator;
	moviePageWriter.innerHTML = writer;
	moviePageActors.innerHTML = actors;
	wishlistSign(moviePageID, mpageAddSign);
};

const createGenre = (genre) => {
	let genreItem = createElement('p');
	genreItem.classList.add('mpage__genre');
	genreItem.innerHTML = genre;
	moviePageGenres.append(genreItem);
};

const addToWatchlist = (ID) => {
	if (!watchlistIDs.includes(ID)) {
		watchlistIDs.push(ID);
		watchlistCount++;
	} else {
		let index = watchlistIDs.indexOf(ID);
		console.log(index);
		watchlistIDs.splice(index, 1);
		watchlistCount--;
	}
	if (watchlistCount > 0) {
		watchlistShortcutCount.classList.remove('hidden');
	} else {
		watchlistShortcutCount.classList.add('hidden');
	}
	watchlistShortcutText.style.color = '#f5c518';
	watchlistShortcutText.style.transform = 'translateY(-2px)';
	setTimeout(() => {
		watchlistShortcutText.style.color = 'white';
		watchlistShortcutText.style.transform = 'translateY(0px)';
	}, 100);
	console.log(watchlistIDs);
	watchlistShortcutCount.innerHTML = watchlistCount;
};

const wishlistSign = (id, element) => {
	if (watchlistIDs.includes(id)) {
		element.innerHTML = '&#10003';
	} else {
		element.innerHTML = '+';
	}
};

const createWatchlistCard = (ID, poster, title, year, runtime, genres, rating, director, actors, plot) => {
	const card = createElement('div');
	card.classList.add('watchlist__card');
	const image = createElement('img');
	image.classList.add('watchlist__card__image');
	image.setAttribute('src', poster);
	image.addEventListener('click', () => {
		getMovieInfo(ID);
	});
	const information = createElement('div');
	information.classList.add('watchlist__card__info');
	const heading = createElement('h1');
	heading.classList.add('watchlist__card__title');
	heading.innerHTML = title;
	heading.addEventListener('click', () => {
		getMovieInfo(ID);
	});
	const subInfo = createElement('div');
	subInfo.classList.add('watchlist__card__subinfo');
	const released = createElement('p');
	released.classList.add('watchlist__card__subinfo__item');
	released.innerHTML = year;
	const time = createElement('p');
	time.classList.add('watchlist__card__subinfo__item');
	let minutes = +runtime.substring(0, runtime.indexOf(' '));
	time.innerHTML = `${Math.floor(minutes / 60)}h ${minutes % 60}m `;
	const moviegenres = createElement('p');
	moviegenres.classList.add('watchlist__card__subinfo__item');
	moviegenres.innerHTML = genres;
	const ratingCont = createElement('div');
	ratingCont.classList.add('watchlist__card__rating');
	const starImg = createElement('img');
	starImg.setAttribute('src', './assets/star.svg');
	starImg.classList.add('watchlist__card__star');
	const ratingNum = createElement('p');
	ratingNum.classList.add('watchlist__card__rating__num');
	ratingNum.innerHTML = rating;
	const people = createElement('div');
	people.classList.add('watchlist__card__people');
	const moviedirector = createElement('p');
	moviedirector.classList.add('watchlist__card__people__item');
	moviedirector.innerHTML = director;
	const movieactors = createElement('p');
	movieactors.classList.add('watchlist__card__people__item');
	movieactors.innerHTML = actors;
	const movieplot = createElement('p');
	movieplot.classList.add('watchlist__card__plot');
	movieplot.innerHTML = plot;
	const breakline = createElement('div');
	breakline.classList.add('break_line');
	const verticalLine = createElement('div');
	verticalLine.classList.add('vertical_line');
	card.append(image, information);
	information.append(heading, subInfo, ratingCont, people, plot);
	subInfo.append(released, verticalLine, time, verticalLine, moviegenres);
	ratingCont.append(starImg, ratingNum);
	people.append(moviedirector, verticalLine, movieactors);
	watchlistContainer.append(card, breakline);
};

const getWatchlist = async (imdbID) => {
	try {
		spinner.classList.remove('hidden');
		const resp = await fetch(`https://www.omdbapi.com/?apikey=86c15441&i=${imdbID}`);
		const result = await resp.json();
		spinner.classList.add('hidden');
		console.log(result);
		createWatchlistCard(
			result.imdbID,
			result.Poster,
			result.Title,
			result.Year,
			result.Runtime,
			result.Genre,
			result.imdbRating,
			result.Director,
			result.Actors,
			result.Plot
		);
	} catch (erorr) {
		loadError();
	}
};

searchBtn.addEventListener('click', () => {
	isIntro = false;
	isWatchlist = false;
	currentPage = 1;
	movieContainer.innerHTML = '';
	moviePageGenres.innerHTML = '';
	introPage.classList.add('hidden');
	movieContainer.classList.remove('minimize');
	searchValue = searchInput.value;
	getMovies(currentPage, searchValue);
});

searchInput.addEventListener('keypress', (event) => {
	if (event.key === 'Enter') {
		searchBtn.click();
	}
});

const loadIntro = () => {
	introPage.classList.remove('hidden');
	pageNav.classList.add('hidden');
	watchlistPage.classList.add('hidden');
	movieContainer.classList.add('minimize');
};

const loadWatchlist = () => {
	moviePage.classList.add('hidden');
	watchlistPage.classList.remove('hidden');
	introPage.classList.add('hidden');
	movieContainer.classList.add('hidden');
};

const loadError = () => {
	moviePage.classList.add('hidden');
	watchlistPage.classList.add('hidden');
	introPage.classList.add('hidden');
	movieContainer.classList.add('hidden');
	pageNav.classList.add('hidden');
	error.classList.remove('hidden');
};

logo.addEventListener('click', () => {
	searchInput.value = '';
	isIntro = true;
	currentPage = 1;
	searchValue = 'welcome';
	getMovies(currentPage, searchValue);
	loadIntro();
});

arrowSearchBtn.addEventListener('click', () => {
	searchInput.setSelectionRange(0, 0);
	searchInput.focus();
});

pageList.addEventListener('click', (event) => {
	movieContainer.innerHTML = '';
	pageList.innerHTML = '';
	if (!event.target.classList.contains('disabled')) {
		if (event.target.classList.contains('next_page')) {
			currentPage++;
			getMovies(currentPage, searchValue);
		} else if (event.target.classList.contains('previous_page')) {
			currentPage--;
			getMovies(currentPage, searchValue);
		}
	}
});

moviePageBack.addEventListener('click', () => {
	if (isWatchlist === true) {
		loadWatchlist();
	} else if (isIntro === true) {
		getMovies(currentPage, searchValue);
		loadIntro();
	} else {
		getMovies(currentPage, searchValue);
		pageNav.classList.remove('hidden');
	}
});

moviePageWishlistBtn.addEventListener('click', () => {
	addToWatchlist(moviePageID);
	wishlistSign(moviePageID, mpageAddSign);
});

watchlistBack.addEventListener('click', () => {
	watchlistPage.classList.add('hidden');
	isWatchlist = false;
	if (isIntro === true) {
		getMovies(currentPage, searchValue);
		loadIntro();
	} else {
		getMovies(currentPage, searchValue);
		pageNav.classList.remove('hidden');
	}
});

watchlistShortcut.addEventListener('click', () => {
	isWatchlist = true;
	loadWatchlist();
	if (watchlistIDs.length === 0) {
		watchlistEmpty.classList.remove('hidden');
	} else {
		watchlistEmpty.classList.add('hidden');
		watchlistCountDisplay.innerHTML = watchlistCount === 1 ? `${watchlistCount} Title` : `${watchlistCount} Titles`;
		for (let movie of watchlistIDs) {
			watchlistContainer.innerHTML = '';
			getWatchlist(movie);
		}
	}
});

getMovies(currentPage, searchValue);
pageNav.classList.add('hidden');
