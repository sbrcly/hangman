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
        if (this.chosenCat === 'movies') this.fetchWinningTerm('https://www.omdbapi.com/', '52fb1527');
        if (this.chosenCat === 'cities') this.fetchWinningTerm('https://api.api-ninjas.com/v1/city', 'MS3gbqI7BDlr66td1tMUfA==IctSDvwtD8NA9Syt');
        if (this.chosenCat === 'tv shows') this.fetchWinningTerm('https://api.tvmaze.com/search/shows', 'dCU23LPubvTssTFr9_d80prYh3nE0KgE');
        if (this.chosenCat === 'books') this.fetchWinningTerm('https://www.googleapis.com/books/v1/volumes', 'AIzaSyDTLD8MbAuYOggXGHaWn20ztduh92IIg3o');
        if (this.chosenCat === 'people') this.fetchWinningTerm('https://api.api-ninjas.com/v1/celebrity', 'MS3gbqI7BDlr66td1tMUfA==IctSDvwtD8NA9Syt')
    };
    fetchWinningTerm = (url, apikey) => {
        const fetchData = async () => {
            if (this.chosenCat === 'movies') {
                const response = await axios.get(url, {
                    params: {
                        apikey: apikey,
                        s: this.mysteryTerm,
                    }
                });
                if (response.data.Search.length > 1) {
                    return response.data.Search[0].imdbID;
                }   else {
                    return response.data.Search.imdbID;
                }
            }
            if (this.chosenCat === 'cities') {
                const response = await axios.get(url, {
                    params: {
                        name: this.mysteryTerm
                    },
                    headers: {
                        'X-Api-Key': apikey
                    }
                });
                    setTimeout(() => {
                        this.parseMysteryTermInfo(response.data[0]);
                        console.log(response.data);
                    }, 2000);
            };
            if (this.chosenCat === 'tv shows') {
                const response = await axios.get(url, {
                    params: {
                        apikey: apikey,
                        q: this.mysteryTerm
                    }
                });
                setTimeout(() => {
                    this.parseMysteryTermInfo(response.data[0].show);
                    console.log(response.data[0].show);
                }, 2000);
            };
            if (this.chosenCat === 'books') {
                const response = await axios.get(url, {
                    params: {
                        key: apikey,
                        q: this.mysteryTerm
                    }
                });
                setTimeout(() => {
                    console.log(response.data.items[0].volumeInfo);
                    this.parseMysteryTermInfo(response.data.items[0].volumeInfo);
                }, 2000);
            };
            if (this.chosenCat === 'people') {
                const response = await axios.get(url, {
                    params: {
                        name: this.mysteryTerm
                    },
                    headers: {
                        'X-Api-Key': apikey
                    }
                });
                setTimeout(() => {
                    this.parseMysteryTermInfo(response.data[0]);
                    console.log(response.data[0]);
                }, 2000);
            }
        }
        fetchData()
        .then((result) => {
            if (this.chosenCat === 'movies') {
                const fetchData = async () => {
                    const response = await axios.get(url, {
                        params: {
                            apikey: apikey,
                            i: result,
                        }
                    });
                    console.log(response);
                    this.parseMysteryTermInfo(response.data);
                };
                setTimeout(() => {
                    fetchData();
                }, 2000);
            } 
        })
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
            this.movieTitle = mysteryTermInfo.Title;
            this.boxOffice = mysteryTermInfo.BoxOffice;
            this.actors = mysteryTermInfo.Actors;
            this.awards = mysteryTermInfo.Awards
            this.plot = mysteryTermInfo.Plot;
            this.ratings = mysteryTermInfo.Ratings[0].Value;
            this.poster = mysteryTermInfo.Poster;
        }
        if (this.chosenCat === 'cities') {
            this.cityName = mysteryTermInfo.name;
            this.population = mysteryTermInfo.population;
            this.latitude = mysteryTermInfo.latitude;
            this.longitude = mysteryTermInfo.longitude;
            this.country = mysteryTermInfo.country;
        }
        if (this.chosenCat === 'tv shows') {
            this.showName = mysteryTermInfo.name;
            this.genre = mysteryTermInfo.genres[0];
            this.showRating = mysteryTermInfo.rating.average;
            this.premierDate = mysteryTermInfo.premiered;
            this.showPlot = mysteryTermInfo.summary;
            this.showImg = mysteryTermInfo.image.original;
        }
        if (this.chosenCat === 'people') {
            this.personName = mysteryTermInfo.name;
            this.birthday = mysteryTermInfo.birthdy;
            this.death = mysteryTermInfo.death;
            this.nationality = mysteryTermInfo.nationality;
            this.occupation = mysteryTermInfo.occupation[0];
            this.netWorth = mysteryTermInfo.net_worth;
        }
        this.displayMysteryTermInfo();
    }
    displayMysteryTermInfo = () => {;
        initialWinHeading.remove();
        this.gameContainer.classList.add('displayWinningStats');
        if (this.chosenCat === 'people') {
            const personStats = [];
            const personName = document.createElement('h1');
            personName.id = 'term-header';
            personName.innerText = this.personName;
            const birthday = document.createElement('h2');
            birthday.id = 'birthday';
            birthday.innerText = `Birthday: ${this.birthday}`;
            const death = document.createElement('h2');
            death.id = 'death';
            if (this.death === undefined) {
                death.innerText = 'Death: Still living'
            }   else {
                console.log(this.death);
                death.innerText = `Death: ${this.death}`;
            }
            const nationality = document.createElement('h2');
            nationality.id = 'nationality';
            nationality.innerText = `Nationality: ${this.nationality.toUpperCase()}`;
            const occupation = document.createElement('h2');
            occupation.id = 'occupation';
            occupation.innerText = `Occupation: ${this.occupation.replaceAll('_', ' ')}`;
            const netWorth = document.createElement('h2');
            netWorth.id = 'net-worth';
            netWorth.innerText = `Net Worth: $${this.netWorth}`;
    
            personStats.push(personName, birthday, death, nationality, occupation, netWorth);
            setTimeout(() => {
                for (let stat of personStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    }
                };
            }, 500);
        };
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
            }, 1000);
        }
        if (this.chosenCat === 'movies') {
            const movieStats = [];
            const title = document.createElement('h1');
            title.id = 'term-header';
            title.innerText = this.movieTitle;
            const profit = document.createElement('h2');
            profit.id = 'profit';
            profit.innerText = `Total Box Office Revenue: ${this.boxOffice}`;
            const actors = document.createElement('h2');
            actors.id = 'actors';
            actors.innerText = `Actors: ${this.actors}`;
            const awards = document.createElement('h2');
            awards.id = 'awards';
            awards.innerText = `Awards: ${this.awards}`;
            const plot = document.createElement('h2');
            plot.id = 'plot';
            plot.innerText = `${this.plot}`;
            const rating = document.createElement('h2');
            rating.id = 'rating';
            rating.innerText = `IMDB Rating: ${this.ratings}`;
            const poster = document.createElement('img');
            poster.id = 'movie-poster';
            poster.src = this.poster;
    
            movieStats.push(title, profit, actors, awards, rating, plot);
            setTimeout(() => {
                for (let stat of movieStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
                winOverlay.append(poster);
            }, 1000);
        }
        if (this.chosenCat === 'cities') {
            const cityStats = [];
            const cityName = document.createElement('h1');
            cityName.id = 'term-header';
            cityName.innerText = this.cityName;
            const population = document.createElement('h2');
            population.id = 'population';
            population.innerText = `Population: ${this.population}`;
            const latitude = document.createElement('h2');
            latitude.id = 'latitude';
            latitude.innerText = `Latitude: ${this.latitude}`;
            const longitude = document.createElement('h2');
            longitude.id = 'longitude';
            longitude.innerText = `Longitude: ${this.longitude}`;
            const country = document.createElement('h2');
            country.id = 'country';
            country.innerText = `Country: ${this.country}`;
    
            cityStats.push(cityName, population, latitude, longitude, country);
            setTimeout(() => {
                for (let stat of cityStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
            }, 500);
        };
        if (this.chosenCat === 'tv shows') {
            const showStats = [];
            const showName = document.createElement('h1');
            showName.id = 'term-header';
            showName.innerText = this.showName;
            const genre = document.createElement('h2');
            genre.id = 'genre';
            genre.innerText = `Genre: ${this.genre}`;
            const showRating = document.createElement('h2');
            showRating.id = 'showRating';
            showRating.innerText = `Rating: ${this.showRating}`;
            const premierDate = document.createElement('h2');
            premierDate.id = 'premierDate';
            premierDate.innerText = `Premier Date: ${this.premierDate}`;
            const showPlot = document.createElement('h2');
            showPlot.id = 'showPlot';
            showPlot.innerHTML = `${this.showPlot}`;
            const showImg = document.createElement('img');
            showImg.id = 'show-img';
            showImg.src = this.showImg;
    
            showStats.push(showName, genre, showRating, premierDate, showPlot);
            setTimeout(() => {
                for (let stat of showStats) {
                    if (stat.innerText !== 'undefined') {
                        stats.append(stat);
                    };
                };
                winOverlay.append(showImg);
            }, 1000);
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
