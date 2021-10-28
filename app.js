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
const categories = ['cities', 'animals', 'people', 'movies', 'tv shows', 'sports', 'books'];

const mysteryTerms = [
    ['Springdale', 'Saint George', 'Boulder City', 'Anaheim', 'Henderson', 'Tijuana', 'Manchester', 'Saint Petersburg','Hong Kong','Fort Lauderdale','Virginia Beach','Boston','Las Vegas', 'London', 'Seattle', 'Salt Lake City', 'Mexico City', 'Mumbai', 'Rio De Janeiro', 'Buenos Aires', 'New York City'],
    ['Shorkie', 'Immortal Jellyfish', 'Great White Shark', 'Tyrannosaurus', 'Woolly Mammoth','Yorkshire Terrier', 'American Bulldog', 'Blue Whale', 'Chameleon', 'Double Doodle', 'Giant Panda Bear', 'Hippopotamus', 'Icelandic Sheepdog', 'Killer Whale', 'Leopard Seal', 'Quagga', 'Poison Dart Frog'],
    ['Sitting Bull', 'Archimedes', 'Marvin Gaye', 'Beethoven', 'Nero', 'Will Smith', 'Ernest Hemingway', 'Pocahontas', 'Whitney Houston', 'William Shakespeare', 'Van Gogh', 'Leonardo DiCaprio', 'Winston Churchill', 'JK Rowling', 'Princess Diana', 'Nelson Mandela', 'Julius Ceasar', 'Cleopatra', 'Abraham Lincoln', 'Martin Luther King', 'Albert Einstein', 'Leonardo da Vinci', 'Thomas Edison', 'Rosa Parks', 'Oprah Winfrey', 'George Orwell', 'Walt Disney', 'Barack Obama', 'Malcolm X', 'Michael Jordon', 'Leo Tolstoy', 'Amelia Earhart', 'Plato', 'Steve Jobs', 'Sigmund Freud', 'Usain Bolt', 'Anne Frank'],
    ['Winnie the Pooh', 'Manchester by the Sea', 'Once Upon a Time In Hollywood', 'The Beauty and the Beast', 'Casablanca', 'The Grinch', 'Jingle All The Way', 'Jurassic Park', 'Toy Story', 'The Shawshank Redemption', 'The Godfather', 'Raiders of the Lost Ark', 'The Dark Knight', 'Jaws', 'Pulp Fiction', 'Good Will Hunting', 'The Truman Show', 'Lawrence of Arabia', 'Snow White and the Seven Dwarfs', 'Forrest Gump', 'Stand By Me', 'Back to the Future', 'Shrek', 'Saving Private Ryan', 'No Country For Old Men', 'Titanic'],
    ['American Horror Stories', 'The Sopranos', 'Friday Night Lights', 'Orange Is the new Black', 'The Walking Dead', 'American Idol', 'The Golden Girls', 'Planet Earth', 'Breaking Bad', 'Game of Thrones', 'The Blue Planet', 'The Office', 'Black Mirror', 'Its Always Sunny In Philadelphia', 'Better Call Saul', 'Peaky Blinders', 'Suits', 'Silicon Valley', 'Sons of Anarchy', 'Ozark'],
    ['Los Angeles Lakers', 'New York Yankees', 'New England Patriots', 'New York Knicks', 'Seattle Seahawks', 'Vegas Golden Knights', 'Boston Red Sox', 'Golden State Warriors', 'Boston Celtics', 'Dallas Mavericks', 'Colorado Avalanche', 'Philadelphia 76ers', 'Philadelphia Eagles', 'Washington Wizards'],
    ['Freakonomics', 'The Intelligent Investor', 'Charlottes Web', 'Animal Farm', 'Travels With Charley In Search For America', 'To Kill a Mockingbird', 'The Lion the Witch and the Wardrobe', 'Harry Potter', 'Ulysses', 'One Hundred Years of Solitude', 'The Odyssey', 'The Brothers Karamazov', 'Crime And Punishment', 'Anna Karenina', 'Things Fall Apart', 'Lord of the Flies', 'Meditations', 'Walden', 'The Prince', 'The Autobiography of Malcolm X', 'Silent Spring', 'In Cold Blood', 'The Electric Kool Aid Acid Test', 'The Art of War', 'Mere Christianity', 'The Bible', 'A Brief History of Time', 'Beyond Good and Evil', 'The Decline and Fall of the Roman Empire']
];

// create letter buttons
for (let letter of alphabet) {
    const letterBtn = document.createElement('button');
    letterBtn.innerText = letter;
    letterBtn.id = letter;
    alphabetBtns.append(letterBtn);
};

const letterBtns = document.querySelectorAll('#alphabet-buttons button');

// create categories
for (let cat of categories) {
    const catOption = document.createElement('option');
    catOption.innerText = cat;
    catOption.value = cat;
    catOption.id = cat;
    categoryOptions.append(catOption);
}

const catOption = document.querySelectorAll('#category-options option');

const game1 = new Game(gameContainer, letterBtns, difficultyBtn, categoryOptions, mysteryValueHolder, livesLeft);

