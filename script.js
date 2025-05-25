// Texts for different meditation experiences
const texts = {
    'calm-breathing': 'Breathing In _ I Enjoy My In-Breath _ Breathing Out _ I Enjoy My Out-Breath _',
    'kindness': `This is what is done,
by one who is skilled in goodness _ 
having glimpsed the state of perfect calm,
let them be honest and upright _
straightforward and gentle in speech,
humble and not conceited _
contented and easily satisfied,
unburdened with duties and frugal in their ways _
peaceful and calm and wise and skillful,
not proud or demanding in nature _
let them not do the slightest thing,
that the wise would later correct _
wishing: in gladness and in safety,
may all beings be happy _
whatever living beings there may be,
whether they are weak or strong, excluding none _
the great or the mighty, medium short or small,
those seen or unseen _
those near or far away,
those born or yet to be born _
may all beings be at ease! _
Let none deceive another, 
or despise any being in any state _
let none through anger or ill-will, 
wish harm upon another _
even as a mother protects with her life, 
her child, her only child _
so with a boundless heart, 
should one cherish all living beings _
cultivate a limitless heart of goodwill, 
for all throughout the cosmos _
in all its height depth and breadth, 
a love that is untroubled _
and beyond hatred and ill-will, 
whether standing or walking, sitting or lying-down _
as long as we are awake, 
maintain this mindfulness of love, _
this is the noblest way of living _
Free from wrong views, greed, and sense desires, 
living in beauty and realizing perfect understanding _
those who practice boundless love, 
will certainly transcend birth and death. _`
};

// Cloud animation properties
const cloudImages = [
    'static/art/clouds_1.png',
    'static/art/clouds_2.png',
    'static/art/clouds_3.png',
    'static/art/clouds_4.png',
    'static/art/clouds_5.png',
    'static/art/clouds_6.png',
    'static/art/clouds_7.png'
];

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textSwitcherBtn = document.getElementById('text-switcher-btn');
    const wordContainer = document.getElementById('word-scroller-container');
    const wordLineElements = Array.from(document.querySelectorAll('.word-line'));
    const wordSpans = Array.from(document.querySelectorAll('.word-line span'));
    const desktopIcon = document.getElementById('desktop-icon');
    const mobileIcon = document.getElementById('mobile-icon');
    
    // State Variables
    let wordsList = [];
    let currentIndex = 0;
    let lineHeight = 0;
    let isPressed = false;
    let pressTimer = null;
    let scrollInterval = null;
    let isScrolling = false;
    let currentTextKey = 'calm-breathing';
    let speedFactor = 0.8; // Default speed factor (1.0 = normal speed, higher = faster, lower = slower)
    
    // Initialize the application
    function init() {
        // Calculate line height
        lineHeight = wordLineElements[0].offsetHeight;
        
        // Initial position of container (top buffer hidden)
        wordContainer.style.top = `-${lineHeight}px`;
        
        // Load initial text
        loadText(texts[currentTextKey]);
        
        // Detect device type
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 520;
        
        // Set appropriate icon
        if (isMobileDevice) {
            desktopIcon.style.display = 'none';
            mobileIcon.style.display = 'block';
        } else {
            desktopIcon.style.display = 'block';
            mobileIcon.style.display = 'none';
        }
        
        // Add event listeners for interactions - exclude the button from starting scroll
        document.body.addEventListener('mousedown', function(e) {
            // Don't trigger scrolling if clicking the text switcher button
            if (!e.target.closest('#text-switcher-btn')) {
                onPressStart(e);
            }
        });
        document.body.addEventListener('mouseup', onPressEnd);
        document.body.addEventListener('mouseleave', onPressEnd);
        
        // Touch events with improved handling for mobile
        document.body.addEventListener('touchstart', function(e) {
            // Don't trigger scrolling if touching the text switcher button
            if (!e.target.closest('#text-switcher-btn')) {
                onPressStart(e);
            }
        }, { passive: true });
        document.body.addEventListener('touchend', function(e) {
            // Only end scrolling if not on the button
            if (!e.target.closest('#text-switcher-btn')) {
                onPressEnd(e);
            }
        });
        
        // Text switcher button event listener with improvements for mobile
        textSwitcherBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event from bubbling up
            
            // Toggle between text options
            currentTextKey = currentTextKey === 'calm-breathing' ? 'kindness' : 'calm-breathing';
            
            // Update button text
            textSwitcherBtn.textContent = currentTextKey === 'calm-breathing' ? 'Switch to Kindness Text' : 'Switch to Breathing Text';
            
            // Load the new text
            loadText(texts[currentTextKey]);
            
            // Ensure scrolling stops if it was happening
            stopScrolling();
            isPressed = false;
        });
        
        // Additional touch event specifically for the button on mobile
        if (isMobileDevice) {
            textSwitcherBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Simulate a click
                textSwitcherBtn.click();
            });
        }
        
        // Keyboard support
        document.body.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && !isPressed) {
                e.preventDefault();
                onPressStart();
            }
        });
        
        document.body.addEventListener('keyup', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                onPressEnd();
            }
        });
    }
    
    // Load and process text
    function loadText(text) {
        // Properly split text into individual words
        const textContent = text.trim();
        // Split by whitespace and filter out empty strings
        wordsList = textContent.split(/\s+/).filter(word => word.length > 0);
        
        // If no words, use a placeholder
        if (wordsList.length === 0) {
            wordsList = ['No', 'text', 'provided'];
        }
        
        console.log('Processed words:', wordsList);
        
        // Reset index and update display
        currentIndex = 0;
        updateDisplay();
    }
    
    // Update the display with current words
    function updateDisplay() {
        // Fill the word slots - each slot gets exactly one word
        for (let i = 0; i < wordLineElements.length; i++) {
            const span = wordLineElements[i].querySelector('span');
            
            // Calculate which word to show in this slot with proper wrapping
            const wordIndex = (currentIndex + i - 1 + wordsList.length) % wordsList.length;
            
            // Get the current word
            const currentWord = wordsList[wordIndex];
            
            // Set word content (just one word per slot)
            // If the word is an underscore, display it as a blank line
            span.textContent = currentWord === '_' ? '' : currentWord;
            
            // Handle aria attributes for screen readers
            if (i === 0 || i === 7) { // Buffer slots
                wordLineElements[i].setAttribute('aria-hidden', 'true');
            } else {
                wordLineElements[i].removeAttribute('aria-hidden');
            }
            
            // Add underline to the newest visible word (6th visible slot)
            if (i === 6) {
                wordLineElements[i].classList.add('newest-visible');
            } else {
                wordLineElements[i].classList.remove('newest-visible');
            }
        }
    }
    
    // Handle press start (mouse down or touch start)
    function onPressStart(event) {
        if (event) event.preventDefault();
        
        clearTimeout(pressTimer);
        
        // 250ms delay before activating scroll
        pressTimer = setTimeout(() => {
            isPressed = true;
            document.body.classList.add('scrolling-active');
            startScrolling();
        }, 250);
    }
    
    // Handle press end (mouse up or touch end)
    function onPressEnd(event) {
        if (event) event.preventDefault();
        
        clearTimeout(pressTimer);
        isPressed = false;
        document.body.classList.remove('scrolling-active');
        stopScrolling();
    }
    
    // Calculate timing values based on speed factor
    function getTimingValues() {
        // Base timing values at speedFactor = 1.0
        const baseStepInterval = 700; // ms between steps
        const baseTransitionDuration = 0.65; // seconds for animation
        const baseTimeoutDuration = 630; // ms for timeout
        
        // Calculate adjusted values
        return {
            stepInterval: Math.round(baseStepInterval / speedFactor),
            transitionDuration: baseTransitionDuration / speedFactor,
            timeoutDuration: Math.round(baseTimeoutDuration / speedFactor)
        };
    }
    
    // Set the speed of text scrolling
    function setScrollSpeed(factor) {
        // Ensure factor is positive
        speedFactor = Math.max(0.1, factor);
        
        // If currently scrolling, restart with new timing
        if (isScrolling) {
            stopScrolling();
            startScrolling();
        }
        
        return speedFactor; // Return the actual value used
    }
    
    // Start the scrolling animation
    function startScrolling() {
        if (!isScrolling && wordsList.length > 0) {
            isScrolling = true;
            const { stepInterval } = getTimingValues();
            scrollInterval = setInterval(scrollStep, stepInterval);
        }
    }
    
    // Stop the scrolling animation
    function stopScrolling() {
        clearInterval(scrollInterval);
        isScrolling = false;
    }
    
    // Handle a single scroll step
    function scrollStep() {
        // Get timing values based on current speed factor
        const { transitionDuration, timeoutDuration } = getTimingValues();
        
        // First, ensure the transition is enabled with timing based on speed factor
        wordContainer.style.transition = `transform ${transitionDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        
        // Animate container moving up one line
        wordContainer.style.transform = `translateY(-${lineHeight}px)`;
        
        // Handle transition end
        setTimeout(() => {
            // Stop if no longer pressed
            if (!isPressed) {
                stopScrolling();
                return;
            }
            
            // Increment current index with wrapping
            currentIndex = (currentIndex + 1) % wordsList.length;
            
            // Update display with new word positions
            updateDisplay();
            
            // Reset container position without animation
            wordContainer.style.transition = 'none';
            wordContainer.style.transform = 'translateY(0)';
            
            // Force reflow to apply style immediately
            void wordContainer.offsetHeight;
            
            // The next animation will happen on the next scrollStep call
        }, timeoutDuration); // Based on speed factor
    }
    
    // Initialize the application
    init();
    
    // Load the initial calm breathing text
    loadText(texts['calm-breathing']);
    
    // Start cloud animations
    startClouds();
    
    // Cloud animation functions
    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function spawnCloud() {
        const cloudsContainer = document.getElementById('clouds-container');
        if (!cloudsContainer) return;
        const cloud = document.createElement('img');
        cloud.src = cloudImages[Math.floor(Math.random() * cloudImages.length)];
        cloud.className = 'cloud';
        
        // Set vertical position first: halfway up mountain and above, but always on screen
        const vh = window.innerHeight;
        const mountainHeight = vh * 0.4;
        const topLimit = Math.max(0, vh - mountainHeight - (vh * 0.65)); // up to 65% above mountain (TOP)
        const bottomLimit = Math.max(0, vh - mountainHeight - (vh * 0.25)); // halfway up mountain (BOTTOM)
        
        // Keep a buffer at top and bottom for a more natural look
        const adjustedTopLimit = topLimit + 20;
        const adjustedBottomLimit = bottomLimit - 20;
        
        // Ensure cloud is fully visible vertically - randomize within bounds
        const y = randomBetween(adjustedTopLimit, adjustedBottomLimit);
        
        // Calculate distance from top as a percentage (0 = at top, 1 = at bottom)
        const distanceFromTop = (y - adjustedTopLimit) / (adjustedBottomLimit - adjustedTopLimit);
        
        // Size (scale) depends on vertical position - bigger at bottom, smaller at top
        // Map from 0.6 (top) to 2.4 (bottom) - 20% larger at bottom
        const scale = 0.6 + (distanceFromTop * 1.8); 
        
        // Set width based on scale
        cloud.style.width = `${160 * scale}px`;
        cloud.style.height = 'auto';
        
        // Compute cloud height (approximate, since image aspect ratio is preserved)
        const cloudHeight = 80 * scale; // assume base cloud height is 80px
        
        // Position cloud
        cloud.style.top = `${y}px`;
        cloud.style.left = '100vw';
        cloud.style.opacity = randomBetween(0.7, 1.0);
        
        // Animation duration: faster for closer clouds (bottom clouds)
        // Map from 75s (top/very slow) to 22.5s (bottom/fast)
        // Top clouds 25% slower (60s * 1.25 = 75s), bottom clouds 10% faster (25s * 0.9 = 22.5s)
        const duration = 75 - (distanceFromTop * 52.5);
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
});
