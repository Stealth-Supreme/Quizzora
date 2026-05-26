// Holographic Reactor Ending Module (Phase 20) for Quizzora_v2
// Triggers 3D layered reactor ring rotations, sweeps voice Synthesis, and swells Audio

import { Terminal } from "./Terminal.js";
import { Audio } from "./Audio.js";
import { Voice } from "./Voice.js";
import { wait } from "./Utils.js";
import { State } from "./State.js";

class HolographicReactor {
  constructor() {
    this.container = null;
    this.isActive = false;
  }

  /**
   * Initializes the reactor container element
   */
  init(container) {
    this.container = container;
    this.isActive = false;
    if (this.container) {
      this.container.classList.add("hidden");
    }
  }

  /**
   * Triggers the beautiful cinematic ascension reactor sequence
   * @param {boolean} isDowngraded whether the user failed to get 20/20
   */
  async trigger(isDowngraded = false) {
    if (!this.container || this.isActive) return;
    this.isActive = true;

    // Dim the screen and start sequence
    document.body.classList.add("reactor-ascension-active");
    if (isDowngraded) {
      this.container.classList.add("reactor-downgraded");
    } else {
      this.container.classList.remove("reactor-downgraded");
    }
    
    const earnedBadges = State.activeBadges || [];
    const badgeHtml = earnedBadges.map(b => `
      <div class="reactor-badge-card badge-${b.toLowerCase().replace(/\s+/g, "-")}">
        <div class="badge-icon">⬢</div>
        <div class="badge-title">${b}</div>
      </div>
    `).join("");

    this.container.classList.remove("hidden");
    this.container.innerHTML = `
      <div class="reactor-wrap">
        <div class="reactor-hud-overlay left">
          <div class="reactor-hud-item"><span class="label">CORE FREQ:</span> <span class="val">880.42 Hz</span></div>
          <div class="reactor-hud-item"><span class="label">NEURAL SYNC:</span> <span class="val">${isDowngraded ? 'PARTIAL' : '100.00%'}</span></div>
          <div class="reactor-hud-item"><span class="label">HOLO PROJ:</span> <span class="val">${isDowngraded ? 'LIMITED' : 'ONLINE'}</span></div>
        </div>
        
        <div class="reactor-hud-overlay right">
          <div class="reactor-hud-item"><span class="label">THERMAL STATUS:</span> <span class="val nominal">NOMINAL</span></div>
          <div class="reactor-hud-item"><span class="label">FIELD SYNC:</span> <span class="val">${isDowngraded ? 'UNSTABLE' : 'SECURE'}</span></div>
          <div class="reactor-hud-item"><span class="label">CONTAINMENT:</span> <span class="val">STABLE</span></div>
        </div>

        ${earnedBadges.length > 0 ? `
        <div class="reactor-badges-panel">
          <div class="reactor-badges-header">SECURED BADGES</div>
          <div class="reactor-badges-flex">
            ${badgeHtml}
          </div>
        </div>
        ` : ''}

        <div class="reactor-scene">
          <div class="reactor-chamber">
            <div class="reactor-ring outer-ring">
              <div class="ring-node"></div>
              <div class="ring-node"></div>
              <div class="ring-node"></div>
              <div class="ring-node"></div>
            </div>
            <div class="reactor-ring middle-ring">
              <div class="ring-segment"></div>
              <div class="ring-segment"></div>
            </div>
            <div class="reactor-ring inner-ring"></div>
            <div class="reactor-holographic-panels">
              <div class="holo-panel panel-t"></div>
              <div class="holo-panel panel-b"></div>
              <div class="holo-panel panel-l"></div>
              <div class="holo-panel panel-r"></div>
            </div>
            <div class="reactor-pulse-core"></div>
            <div class="reactor-flare"></div>
          </div>
        </div>
        
        <div class="reactor-credits-panel">
          <div class="credits-header">
            <span>SYSTEM CREDITS</span>
            <button id="btn-real-credits">See Real Credits</button>
          </div>
          <ul class="credits-list">
            <li>Adavya</li>
            <li>Yuvraj</li>
            <li>Divyam</li>
            <li id="credit-samridh">Samridh</li>
          </ul>
        </div>

        <div class="reactor-footer-banner">
          <div class="scrolling-hud-text">
            ${isDowngraded 
              ? "WARNING: DOWNGRADED REACTOR ACTIVE // ACCESS LIMITED // FULL ASCENSION DENIED" 
              : "WARNING: CORE ASCENSION COMPLETED // SYNAPSE OVERRIDE ACTIVATED // ALL SYSTEMS ONLINE"}
          </div>
        </div>
      </div>
    `;

    // Setup credits button
    const realCreditsBtn = document.getElementById("btn-real-credits");
    if (realCreditsBtn) {
      realCreditsBtn.addEventListener("click", () => {
        const samridhEl = document.getElementById("credit-samridh");
        if (samridhEl) {
          samridhEl.style.transition = "opacity 5s ease";
          samridhEl.style.opacity = "0";
        }
        Voice.speak("Samridh was grinding. Oops! I revealed the truth.", null, null, true);
      });
    }

    // Terminal log sequencing
    await wait(200);
    if (isDowngraded) {
      await Terminal.logTypewriter("SYSTEM OVERRIDE REJECTED. DOWNGRADING...", "SYS", () => Audio.playTick());
      await wait(400);
      await Terminal.logTypewriter("DOWNGRADED REACTOR ONLINE. ACCESS LIMITED.", "SYS", () => Audio.playTick());
      // No huge audio swell for downgraded
      Audio.startAmbientHum();
    } else {
      await Terminal.logTypewriter("SYSTEM OVERRIDE ACCEPTED", "SYS", () => Audio.playTick());
      await wait(400);
      await Terminal.logTypewriter("REACTOR INITIALIZING...", "SYS", () => Audio.playTick());
      await wait(500);
      await Terminal.logTypewriter("POWER CORE ONLINE. ASCENDING MATRIX.", "SYS", () => Audio.playTick());
      
      Audio.startReactorSwell();
      Audio.playUnlock();

      Voice.speakReactorAscension(() => {
        Terminal.log("ASCENSION SYNAPSE REMAINS OPEN.", "AI");
      });
    }
  }

  /**
   * Resets the reactor state back to standby
   */
  reset() {
    this.isActive = false;
    document.body.classList.remove("reactor-ascension-active");
    if (this.container) {
      this.container.classList.remove("reactor-downgraded");
      this.container.classList.add("hidden");
      this.container.innerHTML = "";
    }
    Audio.stopReactor();
  }
}

export const Reactor = new HolographicReactor();
export default Reactor;
