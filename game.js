class Game {
    constructor(gameContainer, letterBtns, difficultyBtn, categoryOptions, mysteryValueHolder, livesLeft) {
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
    changeDifficulty = () => {
        if (this.difficultyBtn.value === 'easy') this.livesLeft.innerText = 9; 
        if (this.difficultyBtn.value === 'medium') this.livesLeft.innerText = 6;
        if (this.difficultyBtn.value === 'hard') this.livesLeft.innerText = 4
        this.resetGame();
        this.displayMysteryTerm();
    }
    chooseMysteryValue = () => {
        this.resetGame();
        this.chosenCat = this.categoryOptions.value;
        const getCatIndex = categories.indexOf(this.chosenCat);
        const random = Math.floor(Math.random() * mysteryTerms[getCatIndex].length);
        this.mysteryTerm = mysteryTerms[getCatIndex][random];
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
        if (this.chosenCat === 'movies') this.fetchWinningTerm();
    };
    fetchWinningTerm = () => {
        const fetchData = async () => {
            const response = await axios.get('https://www.omdbapi.com/', {
                params: {
                    apikey: '52fb1527',
                    s: this.mysteryTerm
                }
            });
            return response.data.Search[0].imdbID;
        };
        fetchData()
        .then((result) => {
            const fetchData = async () => {
                const response = await axios.get('https://www.omdbapi.com/', {
                    params: {
                        apikey: '52fb1527',
                        i: result
                    }
                });
                this.parseMysteryTermInfo(response.data);
            };
            setTimeout(() => {
                fetchData();
            }, 2000);
        })
    };
    parseMysteryTermInfo = (mysteryTermInfo) => {
        console.log(mysteryTermInfo);
        this.movieTitle = mysteryTermInfo.Title;
        this.boxOffice = mysteryTermInfo.BoxOffice;
        this.actors = mysteryTermInfo.Actors;
        this.awards = mysteryTermInfo.Awards
        this.plot = mysteryTermInfo.Plot;
        this.ratings = mysteryTermInfo.Ratings[0].Value;
        this.poster = mysteryTermInfo.Poster;

        this.displayMysteryTermInfo();
    }
    displayMysteryTermInfo = () => {;
        const statsContainer = document.querySelector('#stats');
        initialWinHeading.remove();
        this.gameContainer.classList.add('displayWinningStats');
        const movieStats = [];

        const title = document.createElement('h1');
        title.id = 'movie-title';
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
        plot.innerText = `Plot: ${this.plot}`;

        const rating = document.createElement('h2');
        rating.id = 'rating';
        rating.innerText = `IMDB Rating: ${this.ratings}`;

        const poster = document.createElement('img');
        poster.id = 'movie-poster';
        poster.src = this.poster;

        movieStats.push(title, profit, rating, plot);
        for (let stat of movieStats) {
            if (stat.innerText !== 'undefined') {
                stats.append(title, profit, actors, awards, rating, plot);
            };
        };

        winOverlay.append(poster);
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