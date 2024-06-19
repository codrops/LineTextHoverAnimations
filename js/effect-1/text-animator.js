// Import the TextSplitter class for handling text splitting.
import { TextSplitter } from '../textSplitter.js';

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

// Defines a class to create hover effects on text.
export class TextAnimator {
  constructor(textElement) {
    // Check if the provided element is valid.
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.splitText();
  }

  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
  }

  animate() {
    // Reset any ongoing animations
    this.reset();

    // Query all individual characters in the line for animation.
    const chars = this.splitter.getChars();

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML;
      let repeatCount = 0;
      
      gsap.fromTo(char, {
        opacity: 0
      },
      {
        duration: 0.03,
        onStart: () => {
          // Set --opa to 1 at the start of the animation
          gsap.set(char, { '--opa': 1 });
        },
        onComplete: () => {
          gsap.set(char, {innerHTML: initialHTML, delay: 0.03})
        },
        repeat: 3,
        onRepeat: () => {
          repeatCount++;
          if (repeatCount === 1) {
            // Set --opa to 0 after the first repeat
            gsap.set(char, { '--opa': 0 });
          }
        },
        repeatRefresh: true,
        repeatDelay: 0.04,
        delay: (position+1)*0.07,
        innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
        opacity: 1
      });
    });
  }

  reset() {
    // Reset the text to its original state
    const chars = this.splitter.getChars();
    chars.forEach((char, index) => {
      gsap.killTweensOf(char); // Ensure no ongoing animations
      char.innerHTML = this.originalChars[index];
    });
  }
}
