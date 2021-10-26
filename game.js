class Game {
    constructor(letterBtns, categoryOptions, mysteryValueHolder, livesLeft) {
        this.letterBtns = letterBtns;
        this.categoryOptions = categoryOptions;
        this.mysteryValueHolder = mysteryValueHolder;
        this.livesLeft = livesLeft;
        this.shownLetters = [];

        this.mysteryTerm = undefined;
        this.hideTerm = undefined;

        livesLeft.innerText = 10;

        for (let letter of this.letterBtns) {
            letter.addEventListener('click', () => {
                this.pickLetter(letter);
            }) 
        };
        categoryOptions.addEventListener('change', this.chooseMysteryValue);

        this.chooseMysteryValue();
    }
    pickLetter = (letter) => {
        if (this.mysteryTerm.toLowerCase().indexOf(letter.id) != -1) {
            this.displayLetter(letter);
        }   else {
            this.livesLeft.innerText = this.livesLeft.innerText - 1;
        }
    }
    chooseMysteryValue = () => {
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
                    placeholder[k] = ' ';
                }
            }
        }
        this.mysteryValueHolder.innerText = placeholder.join('');
    }
};