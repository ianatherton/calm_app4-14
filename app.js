const texts = {
    'calm-breathing': 'breathing in, I enjoy my in-breath ~ ~ breathing out, I enjoy my out-breath ~',
    'kindness': `This is what should be done ~
by one who is skilled in goodness, ~
having glimpsed the state of perfect calm: ~
let them be honest and upright, ~
straightforward and gentle in speech, ~
humble and not conceited, ~
contented and easily satisfied ~
unburdened with duties and frugal in their ways ~
peaceful and calm and wise and skillful, ~
not proud or demanding in nature ~
let them not do the slightest thing ~
that the wise would later reprove ~
wishing: in gladness and in safety, ~
may all beings be happy ~
whatever living beings there may be; ~
whether they are weak or strong, excluding none, ~
the great or the mighty, medium short or small ~
those seen or unseen, ~
those near or far away, ~
those born or yet to be born ~
may all beings be at ease! ~
let none deceive another, ~
or despise any being in any state ~
let none through anger or ill-will ~
wish harm upon another ~
even as a mother protects with her life ~
her child, her only child ~
so with a boundless heart ~
should one cherish all living beings; ~
cultivate a limitless heart of goodwill ~
for all throughout the cosmos ~
in all its height, depth and breadth- ~
a love that is untroubled ~
and beyond hatred and ill-will ~
whether standing or walking, sitting or lying, ~
as long as we are awake, ~
maintain this mindfulness of love ~
this is the noblest way of living. ~
free from wrong views, greed, and sensual desires, ~
living in beauty and realizing perfect understanding, ~
those who practice boundless love ~
will certainly transcend birth and death.~`
};

class WordDisplay {
    constructor() {
        this.wordsList = document.getElementById('words-list');
        this.switchButton = document.getElementById('text-selector');
        this.currentTextKey = 'calm-breathing';
        this.words = [];
        this.currentIndex = -1;
        this.isMouseDown = false;
        this.displayInterval = null;
        this.visibleWords = [];

        this.initializeText();
        this.setupEventListeners();
    }

    initializeText() {
        this.words = texts[this.currentTextKey].split(/\s+/);
        this.currentIndex = -1;
        this.wordsList.innerHTML = '';
        this.visibleWords = [];
    }

    setupEventListeners() {
        document.addEventListener('mousedown', () => {
            this.isMouseDown = true;
            if (this.currentIndex === -1) {
                this.showNextWord();
            }
            this.startDisplayingWords();
        });

        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            clearInterval(this.displayInterval);
        });

        this.switchButton.addEventListener('click', () => {
            this.currentTextKey = this.currentTextKey === 'calm-breathing' ? 'kindness' : 'calm-breathing';
            this.initializeText();
        });
    }

    showNextWord() {
        this.currentIndex++;
        if (this.currentIndex >= this.words.length) {
            this.currentIndex = 0;
            // Clear all words when starting over
            this.initializeText();
        }

        // Remove underline from previous newest word
        if (this.visibleWords.length > 0) {
            this.visibleWords[this.visibleWords.length - 1].classList.remove('newest');
        }

        const wordElement = document.createElement('div');
        wordElement.className = 'word newest';
        wordElement.textContent = this.words[this.currentIndex];
        this.wordsList.appendChild(wordElement);
        
        // Force reflow
        void wordElement.offsetWidth;
        
        // Make the new word visible
        wordElement.classList.add('visible');
        this.visibleWords.push(wordElement);

        // Scroll to the new word smoothly
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove old words
        if (this.visibleWords.length > 5) {
            const oldestWord = this.visibleWords.shift();
            oldestWord.classList.add('fade-out');
            setTimeout(() => {
                oldestWord.remove();
            }, 1000);
        }
    }

    startDisplayingWords() {
        clearInterval(this.displayInterval);
        this.displayInterval = setInterval(() => {
            if (!this.isMouseDown) {
                clearInterval(this.displayInterval);
                return;
            }
            this.showNextWord();
        }, 1150);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordDisplay();
});
