// Command Monospace Terminal Module for Quizzora_v2
// Handles inputs logging, automatic bottom scroll alignment, and retro cursors

class CommandTerminal {
  constructor() {
    this.element = null;
    this.typingSpeed = 20;
  }

  /**
   * Initializes the terminal container element
   * @param {HTMLElement} element 
   */
  init(element) {
    this.element = element;
    this.clear();
  }

  hide() {
    if (!this.element) return;
    this.element.classList.add('hidden');
  }

  clear() {
    if (!this.element) return;
    this.element.innerHTML = `
      <div class="terminal-row">
        <span class="terminal-prefix">Adavya&gt;</span>
        <span class="terminal-text">SYSTEM STANDBY. READY TO INITIALIZE VOICEGATE</span>
      </div>
    `;
  }

  /**
   * Appends a log line to the terminal instantly
   * @param {string} message 
   * @param {string} prefix 
   */
  log(message, prefix = "Adavya") {
    if (!this.element) return;

    // Remove cursor from previous lines
    const cursors = this.element.querySelectorAll(".terminal-cursor");
    cursors.forEach(c => c.remove());

    const row = document.createElement("div");
    row.className = "terminal-row";

    const prefSpan = document.createElement("span");
    prefSpan.className = "terminal-prefix";
    prefSpan.textContent = `${prefix}> `;
    row.appendChild(prefSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "terminal-text";
    textSpan.textContent = message.toUpperCase();
    row.appendChild(textSpan);

    const cursorSpan = document.createElement("span");
    cursorSpan.className = "terminal-cursor";
    row.appendChild(cursorSpan);

    this.element.appendChild(row);
    
    // Auto-scroll to the bottom
    this.element.scrollTop = this.element.scrollHeight;
  }

  /**
   * Appends a log line with a typewriter text reveal and typing ticking sounds
   * @param {string} message 
   * @param {string} prefix 
   * @param {function} onTickSound sound synth callback on character
   * @returns {Promise}
   */
  logTypewriter(message, prefix = "Adavya", onTickSound = null) {
    if (!this.element) return Promise.resolve();

    const cursors = this.element.querySelectorAll(".terminal-cursor");
    cursors.forEach(c => c.remove());

    const row = document.createElement("div");
    row.className = "terminal-row";

    const prefSpan = document.createElement("span");
    prefSpan.className = "terminal-prefix";
    prefSpan.textContent = `${prefix}> `;
    row.appendChild(prefSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "terminal-text";
    row.appendChild(textSpan);

    const cursorSpan = document.createElement("span");
    cursorSpan.className = "terminal-cursor";
    row.appendChild(cursorSpan);

    this.element.appendChild(row);
    this.element.scrollTop = this.element.scrollHeight;

    const upperMessage = message.toUpperCase();
    let index = 0;

    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (index < upperMessage.length) {
          textSpan.textContent += upperMessage[index];
          index++;
          if (onTickSound && Math.random() > 0.3) onTickSound();
          this.element.scrollTop = this.element.scrollHeight;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, this.typingSpeed);
    });
  }
}

export const Terminal = new CommandTerminal();
export default Terminal;
