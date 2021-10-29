// DOM selectors
const alphabetBtns = document.querySelector('#alphabet-buttons');
const categoryOptions = document.querySelector('#category-options');
const mysteryValueHolder = document.querySelector('#mystery-value');
const livesLeft = document.querySelector('#lives');
const gameContainer = document.querySelector('#hangman-game');
const difficultyBtn = document.querySelector('#difficulty');
const initialWinHeading = document.querySelector('#initial-win-heading');
const winOverlay = document.querySelector('#win-overlay');

let lives;

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const mysteryTerms = {
        cities: ['Saint George', 'Boulder City', 'Anaheim', 'Tijuana', 'Manchester', 'Saint Petersburg','Hong Kong','Fort Lauderdale','Virginia Beach','Boston','Las Vegas', 'London', 'Seattle', 'Salt Lake City', 'Mexico City', 'Mumbai', 'Rio De Janeiro', 'Buenos Aires', 'New York City'],

        movies: ['Winnie the Pooh', 'Manchester by the Sea', 'Once Upon a Time In Hollywood', 'The Beauty and the Beast', 'Casablanca', 'The Grinch', 'Jingle All The Way', 'Jurassic Park', 'Toy Story', 'The Shawshank Redemption', 'The Godfather', 'Raiders of the Lost Ark', 'The Dark Knight', 'Jaws', 'Pulp Fiction', 'Good Will Hunting', 'The Truman Show', 'Lawrence of Arabia', 'Snow White and the Seven Dwarfs', 'Forrest Gump', 'Stand By Me', 'Back to the Future', 'Shrek', 'Saving Private Ryan', 'No Country For Old Men', 'Titanic'],

        'tv shows': ['American Horror Stories', 'The Sopranos', 'Friday Night Lights', 'Orange Is the new Black', 'The Walking Dead', 'American Idol', 'The Golden Girls', 'Planet Earth', 'Breaking Bad', 'Game of Thrones', 'The Blue Planet', 'The Office', 'Black Mirror', 'Its Always Sunny In Philadelphia', 'Better Call Saul', 'Peaky Blinders', 'Suits', 'Silicon Valley', 'Sons of Anarchy', 'Ozark'],

        books: ['Freakonomics', 'The Intelligent Investor', 'Charlottes Web', 'Animal Farm', 'Travels With Charley In Search For America', 'To Kill a Mockingbird', 'The Lion the Witch and the Wardrobe', 'Harry Potter and the Goblet of Fire', 'Ulysses', 'One Hundred Years of Solitude', 'The Odyssey', 'The Brothers Karamazov', 'Crime And Punishment', 'Anna Karenina', 'Things Fall Apart', 'Lord of the Flies', 'Meditations', 'Walden', 'The Prince', 'The Autobiography of Malcolm X', 'Silent Spring', 'In Cold Blood', 'The Electric Kool Aid Acid Test', 'The Art of War', 'Mere Christianity', 'The Bible', 'A Brief History of Time', 'Beyond Good and Evil', 'The Decline and Fall of the Roman Empire']
}

// create letter buttons
for (let letter of alphabet) {
    const letterBtn = document.createElement('button');
    letterBtn.innerText = letter;
    letterBtn.id = letter;
    alphabetBtns.append(letterBtn);
};

const letterBtns = document.querySelectorAll('#alphabet-buttons button');

// create categories
for (let cat in mysteryTerms) {
    const catOption = document.createElement('option');
    catOption.value = cat;
    catOption.id = cat;
    catOption.innerText = cat;
    categoryOptions.append(catOption);
}

const game1 = new Game(mysteryTerms, gameContainer, letterBtns, difficultyBtn, categoryOptions, mysteryValueHolder, livesLeft);

