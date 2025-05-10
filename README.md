# Smooth Word Scroller

A web application that displays text one word per line, in a continuous, smooth-scrolling manner. The display shows 6 lines visibly at any time, with interaction-driven scrolling that loops seamlessly from end to beginning.

## Features

- Displays text one word per line with smooth upward scrolling
- Shows 6 words at a time in the viewport
- Underlines the newest visible word at the bottom of the viewport
- Click and hold (or touch and hold) for 0.25 seconds to activate scrolling
- Releasing the press immediately stops scrolling
- Keyboard support: Space bar can be used to start/stop scrolling
- Seamless looping from the end of the text back to the beginning
- Accessibility features including ARIA attributes and reduced motion support

## How to Use

1. Open `index.html` in a web browser
2. The application comes with sample text pre-loaded
3. To use your own text, paste it into the text area and click "Load Text"
4. To begin scrolling, click and hold anywhere on the page for 0.25 seconds
5. Release to stop the scrolling

## Technical Implementation

The application uses:
- HTML for the structure of the word scroller and controls
- CSS for styling and animations
- JavaScript for the interactive scrolling behavior and text processing

The design implements an 8-slot system where:
- Top slot is an invisible buffer
- Middle 6 slots are visible to the user
- Bottom slot is an invisible buffer

This approach allows for smooth entrance and exit animations for words.

## Accessibility

- Keyboard control via Space bar
- ARIA attributes for screen reader support
- Support for prefers-reduced-motion media query
- High contrast text for readability
- Responsive design for various screen sizes
