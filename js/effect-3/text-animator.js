// Import the TextSplitter class for handling text splitting.
import { TextSplitter } from '../textSplitter.js';

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];
const randomColors = ['#22a3a9', '#4ca922', '#a99222', '#1d2619']; // Example colors

// Defines a class to create hover effects on text.
export class TextAnimator {
  constructor(textElement) {
    // Check if the provided element is valid.
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.originalChars = []; // Store the original characters
    this.splitText();
  }

  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
    this.originalColors = this.splitter.getChars().map(char => getComputedStyle(char).color);
  }

  animate() {
    // Reset any ongoing animations
    this.reset();

    // Query all individual characters in the line for animation.
    const chars = this.splitter.getChars();

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML;
      let initialColor = getComputedStyle(char).color;

      gsap
      .timeline()
      .fromTo(char, {
          opacity: 0,
          transformOrigin: '50% 0%'
      },
      {
        duration: 0.03,
        ease: 'none',
        onComplete: () => gsap.set(char, { innerHTML: initialHTML, color: initialColor, delay: 0.03 }),
        repeat: 3,
        repeatRefresh: true,
        repeatDelay: 0.1, // delay between repeats
        delay: (position + 1) * 0.08, // delay between chars
        innerHTML: () => {
          const randomChar = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
          const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
          gsap.set(char, { color: randomColor });
          return randomChar;
        },
        opacity: 1
      })
    });
  }

  reset() {
    // Reset the text to its original state
    const chars = this.splitter.getChars();
    chars.forEach((char, index) => {
      gsap.killTweensOf(char); // Ensure no ongoing animations
      char.innerHTML = this.originalChars[index];
      char.style.color = this.originalColors[index]; // Reset the color
    });
  }
}
