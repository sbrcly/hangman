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
        this.shownLetters = [];
        livesLeft.innerText = 9;

        this.letterBtns.forEach((letter) => {
            letter.addEventListener('click', () => {
                this.pickLetterMouse(letter);
            });
        });
        categoryOptions.addEventListener('change', this.chooseMysteryValue);
        difficultyBtn.addEventListener('change', this.changeDifficulty);
        window.addEventListener('keypress', (e) => {
            this.letterBtns.forEach((letter) => {
                if (letter.id === e.key &&
                    letter.classList.contains('wrong') === false) {
                        this.pickLetterKeyboard(e);
                };
            });
        });
        this.newGameBtns.forEach(newGameBtn => newGameBtn.addEventListener('click', this.newGame));

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
        alphabet.forEach(letter => {
            this.hideTerm = placeholder.toLowerCase().replaceAll(`${letter}`, '_');
            placeholder = this.hideTerm;
            this.mysteryValueHolder.innerText = this.hideTerm;
        })
    };
    pickLetterMouse = (letter) => {
         if (this.mysteryTerm.toLowerCase().indexOf(letter.id) != -1) {  
            this.correctLetter(letter);
        }   else {
            this.wrongLetter(letter);
        };
    };
    pickLetterKeyboard = (e) => {
        if (this.gameContainer.classList.contains('win') === false &&
            this.gameContainer.classList.contains('lose') === false) {
            if (this.mysteryTerm.toLowerCase().indexOf(e.key) != -1) {
                this.letterBtns.forEach((letter) => {
                    if (letter.id === e.key) {
                        this.correctLetter(letter);
                    };
                })
            }   else {
                    this.letterBtns.forEach((letter) => {
                        if (letter.id === e.key) {
                            this.wrongLetter(letter);
                        };
                    })
            };
        };
    };
    wrongLetter = (letter) => {
        letter.classList.add('wrong');
        this.livesLeft.innerText = this.livesLeft.innerText - 1;
        if (this.livesLeft.innerText < 4) this.livesLeft.style.backgroundColor = 'rgb(104, 41, 41)';
        if (this.livesLeft.innerText == 0) this.gameOver();
    }
    correctLetter = (letter) => {
        letter.classList.add('correct');
        this.shownLetters.push(letter.id);
        let placeholder = [...this.mysteryTerm];
        for (let i = 0; i < this.mysteryTerm.length; i++) {
            for (let shownLetter of this.shownLetters) {
                if (this.mysteryTerm[i].toLowerCase() != shownLetter) {
                    placeholder[i] = '_';
                };
            };
        };
        for (let j = 0; j < this.mysteryTerm.length; j++) {
            for (let shownLetter of this.shownLetters) {
                if (this.mysteryTerm[j].toLowerCase() === shownLetter) {
                    placeholder[j] = shownLetter;
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
        this.letterBtns.forEach(letter => letter.disabled = true);
        this.gameContainer.classList.remove('lose');
        this.gameContainer.classList.add('win');
        this.difficultyBtn.style.opacity = 0;
        this.getCorrespondingApi();
    };
    getCorrespondingApi = () => {
        if (this.chosenCat === 'movies') {
            this.fetchWinningTerm('https://movies-tvshows-data-imdb.p.rapidapi.com/', '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588', 'movies', 'movie');
        }
        if (this.chosenCat === 'tv shows') {
            this.fetchWinningTerm('https://movies-tvshows-data-imdb.p.rapidapi.com/', '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588', 'shows', 'show');
        }
        if (this.chosenCat === 'random word') this.fetchWinningTerm(`https://wordsapiv1.p.rapidapi.com/words/${this.mysteryTerm}`, '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588');
        if (this.chosenCat === 'books') this.fetchWinningTerm('https://www.googleapis.com/books/v1/volumes', 'AIzaSyDTLD8MbAuYOggXGHaWn20ztduh92IIg3o');
    }
    fetchWinningTerm = (url, apikey, paramType, thenParamType) => {
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
            if (this.chosenCat === 'tv shows' || this.chosenCat === 'movies') {
                const response = await axios.get(url, {
                    params: {
                        type: `get-${paramType}-by-title`,
                        title: this.mysteryTerm
                    },
                    headers: {
                        'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                        'x-rapidapi-key': apikey
                    }
                });
                if (this.chosenCat === 'tv shows') {
                    const correctValue = response.data.tv_results.filter(value => (
                        value.title === this.mysteryTerm    
                    ));
                    return correctValue[0].imdb_id;
                }   else {
                    const correctValue = response.data.movie_results.filter(value => (
                        value.title === this.mysteryTerm    
                    ));
                    return correctValue[0].imdb_id;
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
        .then((result) => {
            if (this.chosenCat === 'tv shows' || this.chosenCat === 'movies') {
                const fetchData = async () => {
                    const response = await axios.get(url, {
                        params: {
                            type: `get-${thenParamType}-details`,
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
            this.word = mysteryTermInfo.word;
            this.partOfSpeech = mysteryTermInfo.results[0].partOfSpeech;
            if (mysteryTermInfo.syllables) this.syllables = mysteryTermInfo.syllables.count;
            this.frequency = mysteryTermInfo.frequency;
            this.synonyms = mysteryTermInfo.results[0].synonyms;
            this.definition = mysteryTermInfo.results[0].definition;
        }
        this.initializeOverlayItems(mysteryTermInfo);
    }
    initializeOverlayItems = (mysteryTermInfo) => {
        initialWinHeading.remove();
        this.stats = [];
        this.gameContainer.classList.add('displayWinningStats');
        if (this.chosenCat === 'random word') {
            const word = document.createElement('h1');
            word.id = 'win-overlay-header';
            word.innerText = this.word;
            const partOfSpeech = document.createElement('h2');
            partOfSpeech.id = 'part-of-speech';
            partOfSpeech.innerHTML = `<span>Part of Speech: ${this.partOfSpeech}</span>`;
            const syllables = document.createElement('h2');
            syllables.id = 'syllables';
            syllables.innerHTML = `<span>Syllables: ${this.syllables}</span>`;
            const frequency = document.createElement('h2');
            frequency.id = 'frequency';
            frequency.innerHTML = `<span>Frequency: ${this.frequency}</span>`;
            const synonyms = document.createElement('h2');
            synonyms.id = 'synonyms';
            synonyms.innerHTML = `<span>Synonyms: ${this.synonyms.join(', ')}</span>`;
            const definition = document.createElement('h2');
            definition.id = 'definition';
            definition.innerHTML = this.definition;
            this.img = document.createElement('img');
            this.img.src = `/random-word-image.jpg`;
    
            this.stats.push(word, partOfSpeech, syllables, frequency, synonyms, definition);
            this.appendOverlayItems();
        }
        if (this.chosenCat === 'tv shows') {
            const showTitle = document.createElement('h1');
            showTitle.id = 'win-overlay-header';
            showTitle.innerText = this.showTitle;
            const premierDate = document.createElement('h2');
            premierDate.id = 'premier-date';
            premierDate.innerHTML = `<span>Premiered: ${this.premierDate}</span>`;
            const showRating = document.createElement('h2');
            showRating.id = 'showRating';
            showRating.innerHTML = `<span>Rating: ${this.showRating}</span>`;
            const showCreators = document.createElement('h2');
            showCreators.id = 'creators';
            showCreators.innerHTML = `<span>Creators: ${this.showCreators.join(', ')}</span>`;
            const showActors = document.createElement('h2');
            showActors.id = 'show-actors';
            let mainShowActors = [];
            for (let i = 0; i < 5; i++) {
                mainShowActors.push(this.showActors[i]);
            }
            showActors.innerHTML = `<span>Actors: ${mainShowActors.join(', ')}</span>`;
            const showPlot = document.createElement('h2');
            showPlot.id = 'showPlot';
            showPlot.innerHTML = `${this.showPlot}`;
    
            this.stats.push(showTitle, premierDate, showRating, showCreators, showActors, showPlot);
            this.fetchOverlayImage('show', mysteryTermInfo); 
        }
        if (this.chosenCat === 'movies') {
            const movieTitle = document.createElement('h1');
            movieTitle.id = 'win-overlay-header';
            movieTitle.innerText = this.movieTitle;
            const tagline = document.createElement('h2');
            tagline.id = 'tagline';
            tagline.innerText = this.tagline;
            const releaseYear = document.createElement('h2');
            releaseYear.id = 'release-year';
            releaseYear.innerHTML = `<span>Release Year: ${this.releaseYear}</span>`;
            const directors = document.createElement('h2');
            directors.id = 'directors';
            directors.innerHTML = `<span>Director: ${this.directors[0]}</span>`;
            const mainCharacters = document.createElement('h2');
            mainCharacters.id = 'main-characters';
            let mainActors = [];
            for (let i = 0; i < 5; i++) {
                mainActors.push(this.actors[i]);
            }
            mainCharacters.innerHTML = `<span>Actors: ${mainActors.join(', ')}</span>`;
            const movieRating = document.createElement('h2');
            movieRating.id = 'movie-rating';
            movieRating.innerHTML = `<span>IMDB Rating: ${this.movieRating}</span>`;
            const moviePlot = document.createElement('h2');
            moviePlot.id = 'movie-plot';
            moviePlot.innerText = this.moviePlot;
    
            this.stats.push(movieTitle, tagline, releaseYear, directors, mainCharacters, movieRating, moviePlot);
            this.fetchOverlayImage('movies', mysteryTermInfo);
        }
        if (this.chosenCat === 'books') {
            const bookTitle = document.createElement('h1');
            bookTitle.id = 'win-overlay-header';
            bookTitle.innerText = this.bookTitle;
            const subtitle = document.createElement('h2');
            subtitle.id = 'subtitle';
            subtitle.innerText = this.subtitle;
            const author = document.createElement('h2');
            author.id = 'author';
            author.innerHTML = `<span>Author: ${this.author}</span>`;
            const bookGenre = document.createElement('h2');
            bookGenre.id = 'book-genre';
            bookGenre.innerHTML = `<span>Genre: ${this.bookGenre}</span>`;
            const bookRating = document.createElement('h2');
            bookRating.id = 'book-rating';
            bookRating.innerHTML = `<span>Rating: ${this.bookRating}</span>`;
            const bookSummary = document.createElement('h2');
            bookSummary.id = 'book-summary';
            bookSummary.innerText = this.bookSummary;
            this.img = document.createElement('img');
            this.img.id = 'book-image';
            this.img.src = mysteryTermInfo.imageLinks.thumbnail;
    
            this.stats.push(bookTitle, subtitle, author, bookGenre, bookRating, bookSummary);
            this.appendOverlayItems();
        }  
    };
    fetchOverlayImage = (mediaType, mysteryTermInfo) => {
        const fetchData = async () => {
            const response = await axios.get('https://movies-tvshows-data-imdb.p.rapidapi.com/', {
                params: {
                    type: `get-${mediaType}-images-by-imdb`,
                    imdb: mysteryTermInfo.imdb_id
                },
                headers: {
                    'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
                    'x-rapidapi-key': '4d4e466a06msh322b9c94c642a3dp1ba99cjsn49b0f9408588'
                }
            })
            this.img = document.createElement('img');
            this.img.src = response.data.poster;
            this.appendOverlayItems();
        }
        fetchData();
    }
    appendOverlayItems = () => {
        setTimeout(() => {
            for (let stat of this.stats) {
                if (stat.innerText !== 'undefined') {
                    statsContainer.append(stat);
                };
            };
            winOverlay.append(this.img);
        }, 1500);
    }
    gameOver = () => {
        this.letterBtns.forEach(letter => letter.disabled = true);
        this.gameContainer.classList.remove('win');
        this.gameContainer.classList.add('lose');
        this.mysteryValueHolder.innerText = this.mysteryTerm;
        this.difficultyBtn.style.opacity = 0;
    };
    changeDifficulty = () => {
        this.evaluateDifficulty();
        this.resetGame();
        this.displayMysteryTerm();
    }
    evaluateDifficulty = () => {
        if (this.difficultyBtn.value === 'easy') this.livesLeft.innerText = 9; 
        if (this.difficultyBtn.value === 'medium') this.livesLeft.innerText = 6;
        if (this.difficultyBtn.value === 'hard') this.livesLeft.innerText = 4
    }
    resetGame = () => {
        this.shownLetters = [];
        this.letterBtns.forEach(letter => {
            letter.disabled = false;
            letter.classList.remove('correct');
            letter.classList.remove('wrong');
        })
        this.evaluateDifficulty();
        this.livesLeft.style.backgroundColor = 'rgb(41, 104, 41)';
    };
    newGame = () => {
        this.resetGame();
        if (this.stats) {
            this.stats.forEach(stat => stat.remove());
            this.img.remove();
        }
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