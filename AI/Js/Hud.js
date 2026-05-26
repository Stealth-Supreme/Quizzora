// Live HUD Orchestration Module for Quizzora_v2
// Synchronizes global system variables with HUD elements

const UPGRADE_NAMES = [
  "Colors & Theme", // 1
  "Layout Refinement", // 2
  "Shell Enhancement", // 3
  "Premium Cards", // 4
  "Motion Engine", // 5
  "HUD Upgrades", // 6
  "Microinteractions", // 7
  "Sound Upgrades", // 8
  "Scan Atmosphere", // 9
  "Progress Intelligence", // 10
  "Reveal Enhancement", // 11
  "Feedback Upgrades", // 12
  "Results Dashboard", // 13
  "Badge System", // 14
  "Polish Layer", // 15
  "Celebration Particle", // 16
  "Neural Sync Ring", // 17
  "Quantum Interface", // 18
  "Synthetic Database", // 19
  "Holographic Reactor Core" // 20
];

class HeadUpDisplay {
  constructor() {
    this.elements = {};
  }

  /**
   * Caches DOM references for HUD fields
   */
  init() {
    this.elements = {
      system: document.getElementById("hud-system"),
      node: document.getElementById("hud-node"),
      score: document.getElementById("hud-score"),
      status: document.getElementById("hud-status"),
      next: document.getElementById("hud-next"),
      unlocked: document.getElementById("hud-unlocked"),
      badgeContainer: document.getElementById("hud-badges")
    };
  }

  /**
   * Refreshes the HUD visual layers using state changes
   * @param {object} state 
   */
  update(state) {
    if (!this.elements.system) this.init();

    // 1. SYSTEM Update
    if (this.elements.system) {
      if (state.phase === 0) {
        this.elements.system.textContent = "QUIZZORA OS [RAW v0.1]";
      } else {
        this.elements.system.textContent = `QUIZZORA OS [SECURE v2.${state.phase}]`;
      }
    }

    // 2. NODE Update
    if (this.elements.node) {
      if (state.assessmentStarted && !state.isCompleted) {
        this.elements.node.textContent = `NODE ${String(state.currentQuestionIndex + 1).padStart(2, "0")}/20`;
      } else if (state.isCompleted) {
        this.elements.node.textContent = "NODES LOCKED";
      } else {
        this.elements.node.textContent = "NODE STANDBY";
      }
    }

    // 3. SCORE Update
    if (this.elements.score) {
      const percentage = state.currentQuestionIndex > 0 
        ? Math.round((state.score / state.currentQuestionIndex) * 100) 
        : 0;
      this.elements.score.textContent = `SCORE: ${state.score}/${state.currentQuestionIndex} (${percentage}%)`;
    }

    // 4. STATUS Update
    if (this.elements.status) {
      if (state.isCompleted) {
        this.elements.status.textContent = state.isPerfectRun ? "CORE ASCENSION" : "DIAGNOSTIC FAILED";
        this.elements.status.className = state.isPerfectRun ? "hud-value status-perfect" : "hud-value status-failed";
      } else if (state.isDecrypting) {
        this.elements.status.textContent = "DECRYPTING NODE...";
        this.elements.status.className = "hud-value status-loading";
      } else if (state.assessmentStarted) {
        this.elements.status.textContent = "DIAGNOSTIC RUNNING";
        this.elements.status.className = "hud-value status-active";
      } else {
        this.elements.status.textContent = "WAITING GATE...";
        this.elements.status.className = "hud-value status-waiting";
      }
    }

    // 5. NEXT UPGRADE Update
    if (this.elements.next) {
      if (state.phase >= 20) {
        this.elements.next.textContent = "MAX SYSTEM REACHED";
      } else {
        this.elements.next.textContent = UPGRADE_NAMES[state.phase] || "SYSTEM OFFLINE";
      }
    }

    // 6. UNLOCKED COMPLIANCES
    if (this.elements.unlocked) {
      this.elements.unlocked.textContent = `PHASE ${state.phase}/20 UNLOCKED`;
    }

    // 7. ACTIVE HUD BADGES
    if (this.elements.badgeContainer) {
      this.elements.badgeContainer.innerHTML = "";
      state.activeBadges.forEach(badge => {
        const badgeSpan = document.createElement("span");
        badgeSpan.className = `hud-badge badge-${badge.toLowerCase().replace(/\s+/g, "-")}`;
        badgeSpan.textContent = badge;
        this.elements.badgeContainer.appendChild(badgeSpan);
      });
    }
  }
}

export const Hud = new HeadUpDisplay();
export default Hud;
export { UPGRADE_NAMES };
