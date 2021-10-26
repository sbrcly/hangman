class Game {
    constructor(letterBtns, categoryOptions, mysteryValueHolder, livesLeft) {
        this.letterBtns = letterBtns;
        this.categoryOptions = categoryOptions;
        this.mysteryValueHolder = mysteryValueHolder;
        this.livesLeft = livesLeft;

        this.mysteryTerm = undefined;
        this.hideTerm = undefined;

        this.shownLetters = [];
        livesLeft.innerText = 7;

        for (let letter of this.letterBtns) {
            letter.addEventListener('click', () => {
                this.pickLetter(letter);
            }) 
        };
        categoryOptions.addEventListener('change', this.chooseMysteryValue);

        this.chooseMysteryValue();
    }
    pickLetter = (letter) => {
        letter.disabled = true;
        if (this.mysteryTerm.toLowerCase().indexOf(letter.id) != -1) {
            letter.classList.add('correct');
            this.displayLetter(letter);
        }   else {
            letter.classList.add('wrong');
            this.livesLeft.innerText = this.livesLeft.innerText - 1;
            if (this.livesLeft.innerText < 6) this.livesLeft.style.backgroundColor = 'rgb(104, 41, 41)';
            if (this.livesLeft.innerText == 0) this.gameOver();
        }
    }
    chooseMysteryValue = () => {
        this.resetGame();
        const chosenCat = this.categoryOptions.value;
        const getCatIndex = categories.indexOf(chosenCat);
        const random = Math.floor(Math.random() * mysteryTerms[getCatIndex].length);
        this.mysteryTerm = mysteryTerms[getCatIndex][random];
        this.displayMysteryTerm();
    }
    displayMysteryTerm = () => {
        let placeholder = this.mysteryTerm;
        for (let char of alphabet) {
           this.hideTerm = placeholder.toLowerCase().replaceAll(`${char}`, '_');
           placeholder = this.hideTerm;
           this.mysteryValueHolder.innerText = this.hideTerm;
        }
    }
    displayLetter = (letter) => {
        this.shownLetters.push(letter.id);
        let showLetter;
        let placeholder = [...this.mysteryTerm];
        for (let i = 0; i < this.mysteryTerm.length; i++) {
            for (let c of this.shownLetters) {
                if (this.mysteryTerm[i].toLowerCase() != c) {
                    placeholder[i] = '_';
                }
            }
        }
        for (let j = 0; j < this.mysteryTerm.length; j++) {
            for (let c of this.shownLetters) {
                if (this.mysteryTerm[j].toLowerCase() === c) {
                    placeholder[j] = c;
                }
            }
        }
        for (let k = 0; k < this.mysteryTerm.length; k++) {
            for (let c of this.shownLetters) {
                if (this.mysteryTerm[k].toLowerCase() === ' ') {
                    placeholder[k] = '  ';
                }
            }
        }
        this.mysteryValueHolder.innerText = placeholder.join('');
        if (this.mysteryValueHolder.innerText.indexOf('_') === -1) this.chickenDinner();
    }
    chickenDinner = () => {
        for (let letter of this.letterBtns) {
            letter.disabled = true;
        }
        setTimeout(() => {
            alert('You Win!')
        }, 500);
        this.livesLeft.style.backgroundColor = 'rgb(41, 104, 41)'
    }
    gameOver = () => {
        for (let letter of this.letterBtns) {
            letter.disabled = true;
        }
        setTimeout(() => {
            alert('You lose!')
        }, 500);
        this.mysteryValueHolder.innerText = this.mysteryTerm;
    }
    resetGame = () => {
        this.shownLetters = [];
        this.livesLeft.innerText = 7;
        for (let letter of this.letterBtns) {
            letter.disabled = false;
            letter.classList.remove('correct');
            letter.classList.remove('wrong');
        }
        this.livesLeft.style.backgroundColor = 'rgb(41, 104, 41)';
    }
};