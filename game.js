class Game {
    constructor(mysteryTerms, gameContainer, letterBtns, difficultyBtn, categoryOptions, mysteryValueHolder, livesLeft, newGameBtns) {
        this.mysteryTerms = mysteryTerms;
        this.gameContainer = gameContainer;
        this.letterBtns = letterBtns;
        this.difficultyBtn = difficultyBtn;
        this.newGameBtns = newGameBtns;
        this.categoryOptions = categoryOptions;
        this.mysteryValueHolder = mysteryValueHolder;
        this.livesLeft = livesLeft;

        this.chosenCat = undefined;
        this.mysteryTerm = undefined;
        this.hideTerm = undefined;

        this.stats = [];
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
                    };
                };
            };
        });
        for (let newGameBtn of this.newGameBtns) {
            newGameBtn.addEventListener('click', this.newGame);
        }

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
        if (this.gameContainer.classList.contains('win') === false &&
            this.gameContainer.classList.contains('lose') === false) {
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
        if (this.chosenCat === 'random word') this.fetchWinningTerm(`https://wordsapiv1.p.rapidapi.com/words/${this.mysteryTerm}`, '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588');
        if (this.chosenCat === 'books') this.fetchWinningTerm('https://www.googleapis.com/books/v1/volumes', 'AIzaSyDTLD8MbAuYOggXGHaWn20ztduh92IIg3o');
        
    };
    fetchWinningTerm = (url, apikey) => {
        // Fetch mystery value
        const fetchData = async () => {
            if (this.chosenCat === 'random word') {
                const response = await axios.get(url, {
                    headers: {
                        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
                        'x-rapidapi-key': apikey
                    }
                });
                setTimeout(() => {
                    this.parseMysteryTermInfo(response.data);

                }, 1500);
            };
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
                if (response.data.tv_results.length > 1) {
                    const shows = [];
                    for (let show of response.data.tv_results) {
                        if (show.title === this.mysteryTerm) {
                            shows.push(show);
                        }
                    }
                    return shows[0].imdb_id;
                }   else {
                    return response.data.tv_results[0].imdb_id;
                }
            }
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
                console.log(response.data);
                if (response.data.movie_results.imdb_id !== undefined) {
                    console.log(`IF: ${response.data.movie_results}`);
                    return response.data.movie_results.imdb_id; 
                }   else {
                    const movies = [];
                    for (let movie of response.data.movie_results) {
                        if (movie.title.length === this.mysteryTerm.length) {
                            movies.push(movie);
                        }
                    }
                    console.log(`Else: ${response.data.movie_results}`);
                    return movies[0].imdb_id;
                }
                    
            }         
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
                    // console.log(response.data);

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
            // this.img = mysteryTermInfo.imageLinks.thumbnail;
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
        if (this.chosenCat === 'tv shows') {
            this.showTitle = mysteryTermInfo.title;
            this.premierDate = mysteryTermInfo.year_started;
            this.showRating = mysteryTermInfo.imdb_rating;
            this.showCreators = mysteryTermInfo.creators;
            this.showActors = mysteryTermInfo.stars;
            this.showPlot = mysteryTermInfo.description;
        }
        if (this.chosenCat === 'random word') {
            console.log(mysteryTermInfo);
            this.word = mysteryTermInfo.word;
            this.partOfSpeech = mysteryTermInfo.results[0].partOfSpeech;
            if (mysteryTermInfo.syllables) this.syllables = mysteryTermInfo.syllables.count;
            this.frequency = mysteryTermInfo.frequency;
            this.synonyms = mysteryTermInfo.results[0].synonyms;
            this.definition = mysteryTermInfo.results[0].definition;
        }
        this.displayMysteryTermInfo(mysteryTermInfo);
    }
    displayMysteryTermInfo = (mysteryTermInfo) => {
        initialWinHeading.remove();
        this.gameContainer.classList.add('displayWinningStats');
        if (this.chosenCat === 'random word') {
            // const wordStats = [];
            const word = document.createElement('h1');
            word.id = 'term-header';
            word.innerText = this.word;
            const partOfSpeech = document.createElement('h2');
            partOfSpeech.id = 'part-of-speech';
            partOfSpeech.innerText = `Part of Speech: ${this.partOfSpeech}`;
            const syllables = document.createElement('h2');
            syllables.id = 'syllables';
            syllables.innerText = `Syllables: ${this.syllables}`;
            const frequency = document.createElement('h2');
            frequency.id = 'frequency';
            frequency.innerText = `Frequency: ${this.frequency}`;
            const synonyms = document.createElement('h2');
            synonyms.id = 'synonyms';
            synonyms.innerText = `Synonyms: ${this.synonyms}`;
            const definition = document.createElement('h2');
            definition.id = 'definition';
            definition.innerHTML = `Definition: ${this.definition}`;
            this.img = document.createElement('img');
            this.img.src = `/random-word-image.jpg`;
    
            this.stats.push(word, partOfSpeech, syllables, frequency, synonyms, definition);
            setTimeout(() => {
                for (let stat of this.stats) {
                    if (stat.innerText !== 'undefined') {
                        statsContainer.append(stat);
                    };
                };
                winOverlay.append(this.img);
            }, 1500);
        }
        if (this.chosenCat === 'tv shows') {
            // const showStats = [];
            const showTitle = document.createElement('h1');
            showTitle.id = 'term-header';
            showTitle.innerText = this.showTitle;
            const premierDate = document.createElement('h2');
            premierDate.id = 'premier-date';
            premierDate.innerText = `Premiered: ${this.premierDate}`;
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
    
            this.stats.push(showTitle, premierDate, showRating, showCreators, showActors, showPlot);
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
                this.img = document.createElement('img');
                this.img.src = response.data.poster;
                setTimeout(() => {
                    for (let stat of this.stats) {
                        if (stat.innerText !== 'undefined') {
                            statsContainer.append(stat);
                        };
                    };
                    winOverlay.append(this.img);
                }, 1500);
            }
            fetchData();
        }
        if (this.chosenCat === 'movies') {
            // const movieStats = [];
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
            mainCharacter.innerText = `Main Actor/Actress: ${this.actors[0]}`;
            const movieRating = document.createElement('h2');
            movieRating.id = 'movie-rating';
            movieRating.innerText = `IMDB Rating: ${this.movieRating}`;
            const moviePlot = document.createElement('h2');
            moviePlot.id = 'movie-plot';
            moviePlot.innerText = this.moviePlot;
    
            this.stats.push(movieTitle, tagline, releaseYear, directors, mainCharacter, movieRating, moviePlot);
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
                this.img = document.createElement('img');
                this.img.src = response.data.poster;
                setTimeout(() => {
                    for (let stat of this.stats) {
                        if (stat.innerText !== 'undefined') {
                            statsContainer.append(stat);
                        };
                    };
                    winOverlay.append(this.img);
                }, 1500);
            }
            fetchData();
        }
        if (this.chosenCat === 'books') {
            // const bookStats = [];
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
            this.img = document.createElement('img');
            this.img.id = 'book-image';
            this.img.src = mysteryTermInfo.imageLinks.thumbnail;
    
            this.stats.push(bookTitle, subtitle, author, bookGenre, bookRating, bookSummary);
            setTimeout(() => {
                for (let stat of this.stats) {
                    if (stat.innerText !== 'undefined') {
                        statsContainer.append(stat);
                    };
                };
                winOverlay.append(this.img);
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
    newGame = () => {
        this.resetGame();
        for (let stat of this.stats) {
            stat.remove();
        }
        this.img.remove();
        this.chosenCat = undefined;
        this.mysteryTerm = undefined;
        this.hideTerm = undefined;

        this.stats = [];
        this.shownLetters = [];
        livesLeft.innerText = 9;
        this.gameContainer.classList.remove('displayWinningStats');
        this.gameContainer.classList.remove('win');
        this.gameContainer.classList.remove('lose');
        this.difficultyBtn.style.opacity = 1;

        this.chooseMysteryValue();
        winOverlay.append(initialWinHeading);
    }
};
