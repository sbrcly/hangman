class Game {
    constructor(mysteryTerms, gameContainer, letterBtns, difficultyBtn, categoryOptions, mysteryValueHolder, livesLeft) {
        this.mysteryTerms = mysteryTerms;
        this.gameContainer = gameContainer;
        this.letterBtns = letterBtns;
        this.difficultyBtn = difficultyBtn;
        this.categoryOptions = categoryOptions;
        this.mysteryValueHolder = mysteryValueHolder;
        this.livesLeft = livesLeft;

        this.chosenCat = undefined;
        this.mysteryTerm = undefined;
        this.hideTerm = undefined;

        this.shownLetters = [];
        livesLeft.innerText = 9;

        for (let letter of this.letterBtns) {
            letter.addEventListener('click', () => {
                this.pickLetterClick(letter);
            });
        };
        categoryOptions.addEventListener('change', this.chooseMysteryValue);
        difficultyBtn.addEventListener('change', this.changeDifficulty);
        window.addEventListener('keypress', (e) => {
            for (let letter of this.letterBtns) {
                if (letter.id === e.key) {
                    if (letter.classList.contains('wrong') === false) {
                        this.pickLetterType(e);
                    }
                }
            }
        })

        this.chooseMysteryValue();
    };
    chooseMysteryValue = () => {
        this.resetGame();
        this.chosenCat = this.categoryOptions.value;
        let randomValue = Math.floor(Math.random() * this.mysteryTerms[this.chosenCat].length);
        this.mysteryTerm = this.mysteryTerms[this.chosenCat][randomValue];

        this.displayMysteryTerm();
    };
    displayMysteryTerm = () => {
        let placeholder = this.mysteryTerm;
        for (let char of alphabet) {
           this.hideTerm = placeholder.toLowerCase().replaceAll(`${char}`, '_');
           placeholder = this.hideTerm;
           this.mysteryValueHolder.innerText = this.hideTerm;
        };
    };
    pickLetterClick = (letter) => {
        letter.disabled = true;
        if (this.mysteryTerm.toLowerCase().indexOf(letter.id) != -1) {
            letter.classList.add('correct');
            this.displayLetter(letter);
        }   else {
            letter.classList.add('wrong');
            this.livesLeft.innerText = this.livesLeft.innerText - 1;
            if (this.livesLeft.innerText < 4) this.livesLeft.style.backgroundColor = 'rgb(104, 41, 41)';
            if (this.livesLeft.innerText == 0) this.gameOver();
        };
    };
    pickLetterType = (e) => {
        if (this.mysteryTerm.toLowerCase().indexOf(e.key) != -1) {
            for (let letter of this.letterBtns) {
                if (letter.id === e.key) {
                    letter.classList.add('correct');
                    this.displayLetter(letter);
                };
            };
        }   else {
            for (let letter of this.letterBtns) {
                if (letter.id === e.key) {
                    letter.disabled = true;
                    letter.classList.add('wrong');
                    this.livesLeft.innerText = this.livesLeft.innerText - 1;
                    if (this.livesLeft.innerText < 4) this.livesLeft.style.backgroundColor = 'rgb(104, 41, 41)';
                    if (this.livesLeft.innerText == 0) this.gameOver();
                };
            };
        };
    };
    displayLetter = (letter) => {
        this.shownLetters.push(letter.id);
        let showLetter;
        let placeholder = [...this.mysteryTerm];
        for (let i = 0; i < this.mysteryTerm.length; i++) {
            for (let c of this.shownLetters) {
                if (this.mysteryTerm[i].toLowerCase() != c) {
                    placeholder[i] = '_';
                };
            };
        };
        for (let j = 0; j < this.mysteryTerm.length; j++) {
            for (let c of this.shownLetters) {
                if (this.mysteryTerm[j].toLowerCase() === c) {
                    placeholder[j] = c;
                };
            };
        };
        for (let k = 0; k < this.mysteryTerm.length; k++) {
            for (let c of this.shownLetters) {
                if (this.mysteryTerm[k].toLowerCase() === ' ') {
                    placeholder[k] = '  ';
                };
            };
        };
        this.mysteryValueHolder.innerText = placeholder.join('');
        if (this.mysteryValueHolder.innerText.indexOf('_') === -1) this.chickenDinner();
    };
    chickenDinner = () => {
        for (let letter of this.letterBtns) {
            letter.disabled = true;
        };
        this.gameContainer.classList.remove('lose');
        this.gameContainer.classList.add('win');
        this.livesLeft.style.backgroundColor = 'rgb(41, 104, 41)';
        this.difficultyBtn.style.opacity = 0;
        if (this.chosenCat === 'movies' || this.chosenCat === 'tv shows') {
            this.fetchWinningTerm('https://movies-tvshows-data-imdb.p.rapidapi.com/', '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588');
        }
        if (this.chosenCat === 'cities') this.fetchWinningTerm('https://en.wikipedia.org/w/api.php', '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588');
        // if (this.chosenCat === 'tv shows') this.fetchWinningTerm('https://movies-tvshows-data-imdb.p.rapidapi.com/', '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588');
        if (this.chosenCat === 'books') this.fetchWinningTerm('https://www.googleapis.com/books/v1/volumes', 'AIzaSyDTLD8MbAuYOggXGHaWn20ztduh92IIg3o');
    };
    fetchWinningTerm = (url, apikey) => {
        // Fetch mystery value
        const fetchData = async () => {
            if (this.chosenCat === 'tv shows') {
                const response = await axios.get(url, {
                    params: {
                        type: 'get-shows-by-title',
                        title: this.mysteryTerm
                    },
                    headers: {
                        'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                        'x-rapidapi-key': apikey
                    }
                });
                // if (response.data.tv_results.length) {
                    const shows = [];
                    for (let show of response.data.tv_results) {
                        if (show.title.length === this.mysteryTerm.length) {
                            shows.push(show);
                        }
                    }
                    return shows[0].imdb_id;
            };
            if (this.chosenCat === 'movies') {
                const response = await axios.get(url, {
                    params: {
                        type: 'get-movies-by-title',
                        title: this.mysteryTerm
                    },
                    headers: {
                        'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                        'x-rapidapi-key': apikey
                    }
                });
                    const movies = [];
                    for (let movie of response.data.movie_results) {
                        if (movie.title.length === this.mysteryTerm.length) {
                            movies.push(movie);
                        }
                    }
                    return movies[0].imdb_id;
            }
            if (this.chosenCat === 'cities') {
                const response = await axios.get(url, {
                    params: {
                        origin: '*',
                        format: 'json',
                        action: 'query',
                        prop: 'pageprops',
                        ppprop: 'wikibase_item',
                        redirects: 1,
                        titles: this.mysteryTerm
                    }
                });
                let extractId = response.data.query.pages;
                let pageId;
                for (let key in extractId) {
                    pageId = key;
                }
                return extractId[pageId].pageprops.wikibase_item;
            };
            
            if (this.chosenCat === 'books') {
                const response = await axios.get(url, {
                    params: {
                        key: apikey,
                        q: this.mysteryTerm
                    }
                });
                setTimeout(() => {
                    this.parseMysteryTermInfo(response.data.items[0].volumeInfo);
                }, 1500);
            };
        };
        fetchData()
        // fetch mystery value details
        .then((result) => {
            if (this.chosenCat === 'tv shows') {
                const fetchData = async () => {
                    const response = await axios.get(url, {
                        params: {
                            type: 'get-show-details',
                            imdb: result
                        },
                        headers: {
                            'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                            'x-rapidapi-key': apikey
                        }
                    });
                    this.parseMysteryTermInfo(response.data);
                };
                setTimeout(() => {
                    fetchData();
                }, 1500);
            };
            if (this.chosenCat === 'movies') {
                const fetchData = async () => {
                    const response = await axios.get(url, {
                        params: {
                            type: 'get-movie-details',
                            imdb: result
                        },
                        headers: {
                            'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                            'x-rapidapi-key': apikey
                        }
                    });
                    this.parseMysteryTermInfo(response.data);
                };
                setTimeout(() => {
                    fetchData();
                }, 1500);
            };
            if (this.chosenCat === 'cities') {
                const fetchData = async () => {
                    const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${result}`, {
                        headers: {
                            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                            'x-rapidapi-key': apikey
                        }
                    });
                    this.parseMysteryTermInfo(response.data.data);   
                };
                setTimeout(() => {
                    fetchData()
                }, 1500);
            };
        });
    };
    parseMysteryTermInfo = (mysteryTermInfo) => {
        if (this.chosenCat === 'books') {
            this.bookTitle = mysteryTermInfo.title;
            if (mysteryTermInfo.subtitle) this.subtitle = mysteryTermInfo.subtitle;
            this.author = mysteryTermInfo.authors[0];
            if (mysteryTermInfo.categories) this.bookGenre = mysteryTermInfo.categories[0];
            if (mysteryTermInfo.averageRating) this.bookRating = mysteryTermInfo.averageRating;
            this.bookSummary = mysteryTermInfo.description;
            this.bookImg = mysteryTermInfo.imageLinks.thumbnail;
        }
        if (this.chosenCat === 'movies') {
            this.movieTitle = mysteryTermInfo.title;
            this.tagline = mysteryTermInfo.tagline;
            this.releaseYear = mysteryTermInfo.year;
            this.directors = mysteryTermInfo.directors;
            this.actors = mysteryTermInfo.stars;
            this.movieRating = mysteryTermInfo.imdb_rating;
            this.moviePlot = mysteryTermInfo.description;
        }
        if (this.chosenCat === 'cities') {
            this.cityName = mysteryTermInfo.name;
            this.country = mysteryTermInfo.country;
            this.population = mysteryTermInfo.population;
            this.latitude = mysteryTermInfo.latitude;
            this.longitude = mysteryTermInfo.longitude;
            this.elevation = mysteryTermInfo.elevationMeters;
            this.timeZone = mysteryTermInfo.timezone.replaceAll('_', ' ');
        }
        if (this.chosenCat === 'tv shows') {
            this.showTitle = mysteryTermInfo.title;
            this.premierDate = mysteryTermInfo.year_started;
            this.genre = mysteryTermInfo.genres[0];
            this.showRating = mysteryTermInfo.imdb_rating;
            this.showCreators = mysteryTermInfo.creators;
            this.showActors = mysteryTermInfo.stars;
            this.showPlot = mysteryTermInfo.description;
        }
        this.displayMysteryTermInfo(mysteryTermInfo);
    }
    displayMysteryTermInfo = (mysteryTermInfo) => {
        initialWinHeading.remove();
        this.gameContainer.classList.add('displayWinningStats');
        if (this.chosenCat === 'tv shows') {
            const showStats = [];
            const showTitle = document.createElement('h1');
            showTitle.id = 'term-header';
            showTitle.innerText = this.showTitle;
            const premierDate = document.createElement('h2');
            premierDate.id = 'premier-date';
            premierDate.innerText = `Premiered: ${this.premierDate}`;
            const genre = document.createElement('h2');
            genre.id = 'genre';
            genre.innerText = `Genre: ${this.genre}`;
            const showRating = document.createElement('h2');
            showRating.id = 'showRating';
            showRating.innerText = `Rating: ${this.showRating}`;
            const showCreators = document.createElement('h2');
            showCreators.id = 'creators';
            showCreators.innerText = `Creators: ${this.showCreators}`;
            const showActors = document.createElement('h2');
            showActors.id = 'show-actors';
            showActors.innerText = `Actors: ${this.showActors}`;
            const showPlot = document.createElement('h2');
            showPlot.id = 'showPlot';
            showPlot.innerHTML = `${this.showPlot}`;
    
            showStats.push(showTitle, premierDate, genre, showRating, showCreators, showActors, showPlot);
            setTimeout(() => {
                for (let stat of showStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
            }, 2000);
            const fetchData = async () => {
                const response = await axios.get('https://movies-tvshows-data-imdb.p.rapidapi.com/', {
                    params: {
                        type: 'get-show-images-by-imdb',
                        imdb: mysteryTermInfo.imdb_id
                    },
                    headers: {
                        'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                        'x-rapidapi-key': '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588'
                    }
                })
                console.log(response.data);
                const showPoster = document.createElement('img');
                showPoster.src = response.data.poster;
                winOverlay.append(showPoster);
            }
            setTimeout(() => {
                fetchData()
            }, 1600);
            
        }
        if (this.chosenCat === 'cities') {
            const cityStats = [];
            const cityName = document.createElement('h1');
            cityName.id = 'term-header';
            cityName.innerText = this.cityName;
            const country = document.createElement('h2');
            country.id = 'country';
            country.innerText = this.country;
            const population = document.createElement('h2');
            population.id = 'population';
            population.innerText = `Population: ${this.population}`;
            const latitude = document.createElement('h2');
            latitude.id = 'latitude';
            latitude.innerText = `Latitude: ${this.latitude}`;
            const longitude = document.createElement('h2');
            longitude.id = 'longitude';
            longitude.innerText = `Longitude: ${this.longitude}`;
            const elevation = document.createElement('h2');
            elevation.id = 'elevation';
            elevation.innerText = `Elevation: ${this.elevation}`;
            const timeZone = document.createElement('h2');
            timeZone.id = 'time-zone';
            timeZone.innerText = `Time Zone: ${this.timeZone}`;
    
            cityStats.push(cityName, country, population, latitude, longitude, elevation, timeZone);
            setTimeout(() => {
                for (let stat of cityStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
            }, 2000);
        };
        if (this.chosenCat === 'movies') {
            const movieStats = [];
            const movieTitle = document.createElement('h1');
            movieTitle.id = 'term-header';
            movieTitle.innerText = this.movieTitle;
            const tagline = document.createElement('h2');
            tagline.id = 'tagline';
            tagline.innerText = this.tagline;
            const releaseYear = document.createElement('h2');
            releaseYear.id = 'release-year';
            releaseYear.innerText = `Release Year: ${this.releaseYear}`;
            const directors = document.createElement('h2');
            directors.id = 'directors';
            directors.innerText = `Directors: ${this.directors}`;
            const mainCharacter = document.createElement('h2');
            mainCharacter.id = 'main-character';
            mainCharacter.innerText = `Actors: ${this.actors[0]}`;
            const movieRating = document.createElement('h2');
            movieRating.id = 'movie-rating';
            movieRating.innerText = `IMDB Rating: ${this.movieRating}`;
            const moviePlot = document.createElement('h2');
            moviePlot.id = 'movie-plot';
            moviePlot.innerText = this.moviePlot;
    
            movieStats.push(movieTitle, tagline, releaseYear, directors, mainCharacter, movieRating, moviePlot);
            setTimeout(() => {
                for (let stat of movieStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
            }, 2000);
            const fetchData = async () => {
                const response = await axios.get('https://movies-tvshows-data-imdb.p.rapidapi.com/', {
                    params: {
                        type: 'get-movies-images-by-imdb',
                        imdb: mysteryTermInfo.imdb_id
                    },
                    headers: {
                        'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                        'x-rapidapi-key': '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588'
                    }
                })
                const moviePoster = document.createElement('img');
                moviePoster.src = response.data.poster;
                winOverlay.append(moviePoster);
            }
            setTimeout(() => {
                fetchData()
            }, 1600);
        }
        if (this.chosenCat === 'books') {
            const bookStats = [];
            const bookTitle = document.createElement('h1');
            bookTitle.id = 'term-header';
            bookTitle.innerText = this.bookTitle;
            const subtitle = document.createElement('h2');
            subtitle.id = 'subtitle';
            subtitle.innerText = this.subtitle;
            const author = document.createElement('h2');
            author.id = 'author';
            author.innerText = `Author: ${this.author}`;
            const bookGenre = document.createElement('h2');
            bookGenre.id = 'book-genre';
            bookGenre.innerText = `Genre: ${this.bookGenre}`;
            const bookRating = document.createElement('h2');
            bookRating.id = 'book-rating';
            bookRating.innerText = `Rating: ${this.bookRating}`;
            const bookSummary = document.createElement('h2');
            bookSummary.id = 'book-summary';
            bookSummary.innerText = this.bookSummary;
            const bookImg = document.createElement('img');
            bookImg.id = 'book-image';
            bookImg.src = this.bookImg;
    
            bookStats.push(bookTitle, subtitle, author, bookGenre, bookRating, bookSummary);
            setTimeout(() => {
                for (let stat of bookStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
                winOverlay.append(bookImg);
            }, 2000);
        }  
        
    };
    gameOver = () => {
        for (let letter of this.letterBtns) {
            letter.disabled = true;
        };
        this.gameContainer.classList.remove('win');
        this.gameContainer.classList.add('lose');
        this.mysteryValueHolder.innerText = this.mysteryTerm;
        this.difficultyBtn.style.opacity = 0;
    };
    changeDifficulty = () => {
        if (this.difficultyBtn.value === 'easy') this.livesLeft.innerText = 9; 
        if (this.difficultyBtn.value === 'medium') this.livesLeft.innerText = 6;
        if (this.difficultyBtn.value === 'hard') this.livesLeft.innerText = 4
        this.resetGame();
        this.displayMysteryTerm();
    }
    resetGame = () => {
        this.shownLetters = [];
        for (let letter of this.letterBtns) {
            letter.disabled = false;
            letter.classList.remove('correct');
            letter.classList.remove('wrong');
        };
        if (this.difficultyBtn.value === 'easy') this.livesLeft.innerText = 9; 
        if (this.difficultyBtn.value === 'medium') this.livesLeft.innerText = 6;
        if (this.difficultyBtn.value === 'hard') this.livesLeft.innerText = 4
        this.livesLeft.style.backgroundColor = 'rgb(41, 104, 41)';
    };
};
