// Utilities Module for Quizzora_v2
// Handles delays, typewriter sweeps, and character-scramble decryption animations

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Types text into an element char by char
 * @param {HTMLElement} element 
 * @param {string} text 
 * @param {number} speed ms per character
 * @param {function} onTick callback on each typed character
 * @returns {Promise}
 */
export function typewriter(element, text, speed = 30, onTick = null) {
  return new Promise(resolve => {
    element.textContent = "";
    let index = 0;
    
    function tick() {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        if (onTick) onTick();
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    }
    tick();
  });
}

/**
 * Decrypts text inside an element with randomized matrix-style scrambles
 * @param {HTMLElement} element 
 * @param {string} targetText 
 * @param {number} duration animation length in ms
 * @param {function} onTick callback on character change (for ticking audio)
 * @returns {Promise}
 */
export function scrambleText(element, targetText, duration = 1200, onTick = null) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()<>[]{}?/\\|";
  const length = targetText.length;
  let start = null;

  return new Promise(resolve => {
    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      let currentText = "";
      for (let i = 0; i < length; i++) {
        const char = targetText[i];
        if (char === " " || char === "\n" || char === ":" || char === "?" || char === "." || char === "(" || char === ")" || char === "_") {
          currentText += char;
          continue;
        }

        // The closer progress is to 1, the more characters are fully decrypted
        const revealThreshold = progress;
        if (i / length < revealThreshold) {
          currentText += char;
        } else {
          currentText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = currentText;
      if (onTick && Math.random() > 0.4) onTick(); // trigger periodic sound ticks

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = targetText;
        resolve();
      }
    }
    requestAnimationFrame(animate);
  });
}
export default { wait, typewriter, scrambleText };
