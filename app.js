const texts = {
    'calm-breathing': 'breathing in, I enjoy my in-breath ~ ~ breathing out, I enjoy my out-breath ~',
    'kindness': `This is what is done ~
by one skilled in goodness ~
having glimpsed the state of perfect calm ~
let them be honest and upright ~
straightforward and gentle in speech ~
humble and not conceited ~
contented and easily satisfied ~
unburdened with duties and frugal in their ways ~
peaceful and calm and wise and skillful ~
not proud or demanding in nature ~
let them not do the slightest thing ~
that the wise would later correct ~
wishing: in gladness and in safety ~
May all beings be happy! ~
whatever living beings there may be; ~
whether they are weak or strong, excluding none ~
tall or short, big or small, seen or unseen, near or far away ~
born or yet-to-be born ~
May all beings be at ease! ~
let none deceive another ~
or despise any being in any state ~
let none through anger or ill-will ~
wish harm upon another ~
even as a mother protects with her life ~
her child, her only child ~
so with a boundless heart ~
should one cherish all living beings ~
cultivate a limitless heart of goodwill ~
for all throughout the cosmos ~
in all its height depth and breadth ~
a love that is untroubled ~
and beyond hatred and ill-will ~
whether standing or walking, sitting or lying-down ~
as long as we are awake ~
maintain this mindfulness of love ~
this is the noblest way of living ~
Free from wrong views, greed, and sense desires, living in beauty and realizing perfect understanding, those who practice boundless love will certainly transcend birth and death.~`
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

        // Add debug display
        this.debugDisplay = document.getElementById('debug-display');

        this.initializeText();
        this.setupEventListeners();
        this.setDebugDisplay();
    }

    initializeText() {
        this.words = texts[this.currentTextKey].split(/\s+/);
        this.currentIndex = -1;
        this.wordsList.innerHTML = '';
        this.visibleWords = [];
    }

    setupEventListeners() {
        // Utility to detect mobile browser
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            // Mobile: Use touch events
            document.addEventListener('touchstart', (e) => {
                this.isMouseDown = true;
                if (this.currentIndex === -1) {
                    this.showNextWord();
                }
                this.startDisplayingWords();
            });
            document.addEventListener('touchend', (e) => {
                this.isMouseDown = false;
                clearInterval(this.displayInterval);
            });
        } else {
            // Desktop: Use mouse events
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
        }

        this.switchButton.addEventListener('click', () => {
            this.currentTextKey = this.currentTextKey === 'calm-breathing' ? 'kindness' : 'calm-breathing';
            this.initializeText();
        });
    }

    setDebugDisplay() {
        if (this.debugDisplay) {
            const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            this.debugDisplay.textContent = isMobile ? 'Mobile mode' : 'Desktop mode';
        }
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

        // No scrolling needed; smooth transitions are handled by CSS

        // If queue is full, smoothly scroll the group up
        if (this.visibleWords.length > 5) {
            const wordsList = this.wordsList;
            const wordHeight = this.visibleWords[0].offsetHeight + parseFloat(getComputedStyle(wordsList).gap || 0);
            wordsList.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
            wordsList.style.transform = `translateY(-${wordHeight}px)`;

            setTimeout(() => {
                // Remove the top word after scroll
                const oldestWord = this.visibleWords.shift();
                if (oldestWord && oldestWord.parentNode) {
                    oldestWord.parentNode.removeChild(oldestWord);
                }
                // Reset transform for next scroll
                wordsList.style.transition = 'none';
                wordsList.style.transform = 'translateY(0)';
                // Force reflow to apply the reset immediately
                void wordsList.offsetWidth;
                // Restore transition for next time
                wordsList.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
            }, 600);
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
        }, 1050);
    }
}

// --- Cloud Animation Logic ---
const cloudImages = [
    'static/art/clouds_1.png',
    'static/art/clouds_2.png',
    'static/art/clouds_3.png',
    'static/art/clouds_4.png',
    'static/art/clouds_5.png',
    'static/art/clouds_6.png',
    'static/art/clouds_7.png'
];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function spawnCloud() {
    const cloudsContainer = document.getElementById('clouds-container');
    if (!cloudsContainer) return;
    const cloud = document.createElement('img');
    cloud.src = cloudImages[Math.floor(Math.random() * cloudImages.length)];
    cloud.className = 'cloud';
    // Set random size (scale)
    // Use a reasonable scale for large but visible clouds
    const scale = randomBetween(0.8, 1.8);
    cloud.style.width = `${160 * scale}px`;
    cloud.style.height = 'auto';
    // Compute cloud height (approximate, since image aspect ratio is preserved)
    const cloudHeight = 80 * scale; // assume base cloud height is 80px
    // Set random vertical position: halfway up mountain and above, but always on screen
    const vh = window.innerHeight;
    const mountainHeight = vh * 0.4;
    const minY = Math.max(0, vh - mountainHeight - (vh * 0.25)); // halfway up mountain and higher
    const maxY = Math.max(0, vh - mountainHeight - (vh * 0.65)); // up to 65% above mountain
    // Ensure cloud is always fully visible vertically
    const y = randomBetween(Math.max(0, maxY), Math.min(vh - cloudHeight, minY));
    cloud.style.top = `${y}px`;
    cloud.style.left = '100vw';
    cloud.style.opacity = randomBetween(0.7, 1.0);
    // Animation duration: slower for bigger clouds
    const duration = randomBetween(28, 36) * scale; // bigger clouds move slower
    cloud.style.transition = `transform ${duration}s linear, opacity 0.5s`;
    cloudsContainer.appendChild(cloud);
    // Animate
    setTimeout(() => {
        cloud.style.transform = `translateX(-110vw)`;
    }, 50);
    // Remove when offscreen
    setTimeout(() => {
        cloud.style.opacity = 0;
        setTimeout(() => cloud.remove(), 500);
    }, duration * 1000);
}

function startClouds() {
    function loop() {
        spawnCloud();
        setTimeout(loop, randomBetween(2000, 5000));
    }
    loop();
}

document.addEventListener('DOMContentLoaded', () => {
    new WordDisplay();
    startClouds();
});
