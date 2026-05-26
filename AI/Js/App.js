// Orchestrator Bootstrap Entry Module for Quizzora_v2
// Initializes modular visual and audio layers, establishes state listeners, and controls boot scenes

import { State } from "./State.js";
import { Terminal } from "./Terminal.js";
import { Hud } from "./Hud.js";
import { Renderer } from "./Renderer.js";
import { Particles } from "./Particles.js";
import { Reactor } from "./Reactor.js";
import { UnlockEngine } from "./UnlockEngine.js";
import { applyCheat, resetCheats } from "./Cheat.js";
import { Voice } from "./Voice.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize modular containers
  const terminalElement = document.getElementById("terminal-cockpit");
  const particlesCanvas = document.getElementById("particles-canvas");
  const reactorContainer = document.getElementById("reactor-container");

  // Mount components
  Terminal.init(terminalElement);
  Hud.init();
  Renderer.init();
  
  if (particlesCanvas) {
    Particles.init(particlesCanvas);
  }
  
  if (reactorContainer) {
    Reactor.init(reactorContainer);
  }

  // 2. Subscribe HUD updates to State changes
  State.subscribe((state) => {
    Hud.update(state);
  });

  // Subscribe background particles update to Phase state
  State.subscribe((state) => {
    if (state.phase >= 7) {
      Particles.setEnabled(true);
    } else {
      Particles.setEnabled(false);
    }
  });

  // 3. Attach actions to interactive assessment triggers
  const startBtn = document.getElementById("btn-start-assessment");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      Terminal.log("INITIALIZING DIAGNOSTIC NODE 01...", "SYS");
      State.update({
        assessmentStarted: true,
        startTime: Date.now()
      });
      Renderer.triggerCinematicReveal();
    });
  }

  const restartBtn = document.getElementById("btn-restart");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      Terminal.log("RESETTING SYSTEM TO FACTORY WIREFRAME...", "SYS");
      
      // Reset all components
      State.reset();
      UnlockEngine.reset();
      Reactor.reset();
      Terminal.clear();
      resetCheats();

      const skipBtn = document.getElementById("skip-btn-dev");
      if (skipBtn) {
        skipBtn.remove();
      }
      
      // Show landing
      Renderer.showLanding();
    });
  }

  // Cheat System Wiring
  const cheatInput = document.getElementById("cheat-input");
  const cheatSubmit = document.getElementById("cheat-submit");
  if (cheatInput && cheatSubmit) {
    cheatSubmit.addEventListener("click", () => {
      const code = cheatInput.value;
      if (applyCheat(code)) {
        Voice.speak(`Access code accepted. Protocol overridden.`, null, null, true);
        cheatInput.value = "";
      } else {
        Voice.speak("Invalid access code.", null, null, true);
      }
    });
  }

  // 4. Initial Landing scene boot
  Renderer.showLanding();
});
