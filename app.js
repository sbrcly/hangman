// DOM selectors
const alphabetBtns = document.querySelector('#alphabet-buttons');
const categoryOptions = document.querySelector('#category-options');
const mysteryValueHolder = document.querySelector('#mystery-value');
const livesLeft = document.querySelector('#lives');
const gameContainer = document.querySelector('#hangman-game');
const difficultyBtn = document.querySelector('#difficulty');
const initialWinHeading = document.querySelector('#initial-win-heading');
const winOverlay = document.querySelector('#win-overlay');
const loseOverlay = document.querySelector('#lose-overlay');
const newGameBtns = document.querySelectorAll('.new-game');
const statsContainer = document.querySelector('#stats');

let lives;

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const mysteryTerms = {

        movies: ['Jurassic World', 'Guardians of the Galaxy', 'Avatar', 'The Mummy', 'The Mummy Returns', 'Muppet Haunted Mansion', 'Winnie the Pooh', 'Manchester by the Sea', 'Avengers', 'The Magnificent Seven', 'Gone With the Wind', 'Friday Night Lights', 'Remember the Titans', 'The Lion King', 'Frozen', 'Inside Out', 'Casablanca', 'The Grinch', 'Joker', 'The Addams Family', 'Lawless', 'Jingle All The Way', 'Jurassic Park', 'Toy Story', 'The Shawshank Redemption', 'Home Alone', 'Interstellar', 'The Godfather', 'The Wizard of Oz', 'Twister', 'Black Panther', 'West Side Story', 'Gladiator', 'The Wolf of Wall Street', 'Raiders of the Lost Ark', 'The Dark Knight', 'Jaws', 'Pinocchio', 'Pulp Fiction', 'Butch Cassidy and the Sundance Kid', 'Rocky', 'A Quiet Place', 'Ratatouille', 'Spotlight', 'Good Will Hunting', 'The Truman Show', 'La La Land', 'Lawrence of Arabia', 'Snow White and the Seven Dwarfs', 'Forrest Gump', 'Stand By Me', 'Back to the Future', 'Shrek', 'Zootopia', 'Saving Private Ryan', 'Titanic'],

        'tv shows': ['Mad Men', 'Seinfeld', 'The Simpsons', 'The West Wing', 'Friends', 'Parks and Recreation', 'Sex and the City', 'The Black List', 'Designated Survivor', 'American Horror Stories', 'The Wire', 'The Sopranos', 'Friday Night Lights', 'Orange Is the new Black', 'The Walking Dead', 'American Idol', 'The Golden Girls', 'Planet Earth', 'Breaking Bad', 'Game of Thrones', 'The Blue Planet', 'The Office', 'Black Mirror', 'Better Call Saul', 'Peaky Blinders', 'Suits', 'Silicon Valley', 'Sons of Anarchy', 'Ozark'],

        books: ['Freakonomics', 'The Intelligent Investor', 'Charlottes Web', 'Animal Farm', 'Travels With Charley In Search For America', 'To Kill a Mockingbird', 'The Lion the Witch and the Wardrobe', 'Harry Potter and the Goblet of Fire', 'One Hundred Years of Solitude', 'The Odyssey', 'The Brothers Karamazov', 'Crime And Punishment', 'Anna Karenina', 'Things Fall Apart', 'Lord of the Flies', 'Meditations', 'Walden', 'The Prince', 'The Autobiography of Malcolm X', 'In Cold Blood', 'The Electric Kool Aid Acid Test', 'The Art of War', 'Mere Christianity', 'A Brief History of Time', 'The Decline and Fall of the Roman Empire'],

        'random word': ['precious', 'outstanding', 'intelligent', 'poison', 'sleeping', 'behavior', 'sunshine', 'trampoline', 'grave', 'bush', 'circus', 'pumpkin', 'honesty', 'antidote', 'cereal', 'pancake', 'kitchen', 'weight', 'triumph', 'vacation', 'embark', 'oblivious', 'constitution', 'catastrophe', 'accelerate', 'ampersand', 'apparatus', 'archipelago', 'balderdash', 'bamboozle', 'bandwagon', 'cacophony', 'candelabra', 'clandestine', 'desperado', 'doppelganger', 'dumbfounded', 'extraterrestrial', 'flabbergasted', 'flippant', 'gussied', 'heirloom', 'hijinks', 'hippocampus', 'hodgepodge', 'hyperbole', 'incognito', 'jamboree', 'juggernaut', 'juxtaposition', 'kerfuffle', 'lagoon', 'lingo', 'manifesto', 'mastermind', 'monsoon', 'nitwit', 'palindrome', 'pantaloons', 'parallelogram', 'pedagogue', 'quibble', 'ransack', 'rapscallion', 'ricochet', 'rumpus', 'schmooze', 'skirmish', 'sojourn', 'superfluous', 'tomfoolery', 'trapezoid', 'typhoon', 'usurp', 'vagabond', 'vertigo', 'virtuoso', 'wanderlust', 'whimsical', 'wonky', 'xylophone', 'yahoo', 'zeitgeist', 'zoom']
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

const game1 = new Game(mysteryTerms, gameContainer, letterBtns, difficultyBtn, categoryOptions, mysteryValueHolder, livesLeft, newGameBtns);

