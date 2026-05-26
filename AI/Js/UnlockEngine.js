// Progressive Unlock Engine Module for Quizzora_v2
// Computes scores into system compilers and loads corresponding styling nodes

import { State } from "./State.js";
import { Terminal } from "./Terminal.js";
import { Audio } from "./Audio.js";
import { Particles } from "./Particles.js";
import { UPGRADE_NAMES } from "./Hud.js";
import { Voice } from "./Voice.js";

class UnlockCompiler {
  constructor() {
    this.classesMap = {
      1: "unlock-theme",
      2: "unlock-layout",
      3: "unlock-shell",
      4: "unlock-cards",
      5: "unlock-motion",
      6: "unlock-hud",
      7: "unlock-particles",
      8: "unlock-sound",
      9: "unlock-scan",
      10: "unlock-progress",
      11: "unlock-reveal",
      12: "unlock-feedback",
      13: "unlock-results",
      14: "unlock-badges",
      15: "unlock-polish",
      16: "unlock-celebration",
      17: "unlock-sync",
      18: "unlock-quantum",
      19: "unlock-database",
      20: "unlock-reactor"
    };

    this.logMessages = {
      1: "COLORS UNLOCKED. ENABLING HIGH-CONTRAST NEON CHROMATIC THEME.",
      2: "LAYOUT REFINED. STABILIZING DYNAMIC FLEX GRID CENTERING MAPPINGS.",
      3: "SHELL ENHANCED. RE-COMPILING NEON CONSOLE GLOW INDICATORS.",
      4: "PREMIUM GLASS CARDS ONLINE. DETECTING BACKDROP REFRACTION FILTER.",
      5: "MOTION ENGINE READY. PERSPECTIVE TILTING CALIBRATED.",
      6: "HUD UPGRADES ONLINE. LIVE STATUS REGISTRY ACTIVE.",
      7: "MICROINTERACTION ACTIVE. BACKGROUND DRIVEN NEURAL SPARKS GENERATING.",
      8: "SYNTH AUDIO LOADED. HIGH-FIDELITY WEB ACOUSTICS ENABLED.",
      9: "SCAN ATMOSPHERE INTENSIFIED. LASER RADAR COMPILING GRID.",
      10: "INTELLIGENT PERFORMANCE GRAPHS DEPLOYED.",
      11: "reveal MATRIX DECRYPTION COMPILER ONLINE.",
      12: "visual FEEDBACK RIPPLES & SCREENSHAKE COMMITTED.",
      13: "DIAGNOSTIC SUMMARY GRID INITIALIZED.",
      14: "DYNAMICS BADGES MODULE SECURED.",
      15: "POLISH LAYER APPLIED. CUSTOM CYBER CURSOR EMBEDDED.",
      16: "UNLOCKED STAGE CELEBRATIONS AND SPARK SHOCKWAVES.",
      17: "NEURAL GRID OSCILLATION COMPILING.",
      18: "QUANTUM PORT HANDSHAKE REGISTERED.",
      19: "DATABASE CORRELATOR MERGED.",
      20: "CORE REACTOR ONLINE. FULL CORE ASCENSION READY."
    };
  }

  /**
   * Evaluates and compiles state upgrades based on the user's current score
   */
  async evaluateUnlock() {
    const currentScore = State.score;
    const previousPhase = State.phase;

    if (currentScore > previousPhase) {
      // Unlocks the next pending feature! (Catch-up mapping)
      const nextPhase = previousPhase + 1;
      
      State.update({
        phase: nextPhase
      });

      // 1. Add style compilation tag to the body
      const targetClass = this.classesMap[nextPhase];
      if (targetClass) {
        document.body.classList.add(targetClass);
      }

      // 2. Play sound effects
      if (nextPhase >= 8) {
        Audio.unlocked = true; // Unlock procedural sounds
        Audio.playUnlock();
        Audio.startAmbientHum();
      }

      // 3. Spawns/updates particle canvas
      if (nextPhase >= 7) {
        Particles.setEnabled(true);
      }

      // 4. Log to command console terminal
      const logMessage = this.logMessages[nextPhase] || `PHASE ${nextPhase} UPGRADED.`;
      await Terminal.logTypewriter(`SYSTEM UPGRADE: ${logMessage}`, "SYS", () => Audio.playTick());

      // 5. Evaluate and update active badges
      this.evaluateBadges(nextPhase);
    } else {
      // Wrong answer
      await Terminal.logTypewriter("DIAGNOSTIC CORRELATION ERROR: MODULE UNCHANGED.", "ERR", () => Audio.playTick());
    }
  }

  /**
   * Decides which badges are unlocked dynamically
   * @param {number} phase 
   */
  evaluateBadges(phase) {
    const badges = [...State.activeBadges];
    let newBadge = null;

    if (phase >= 1 && !badges.includes("FIRST NODE")) {
      newBadge = "FIRST NODE";
    }
    if (phase >= 10 && !badges.includes("MIDWAY CONTROL")) {
      newBadge = "MIDWAY CONTROL";
    }
    if (phase >= 15 && !badges.includes("STABLE HAND")) {
      newBadge = "STABLE HAND";
    }
    if (phase >= 18 && !badges.includes("ELITE OPERATOR")) {
      newBadge = "ELITE OPERATOR";
    }
    if (phase === 20 && !badges.includes("FULL SYSTEM MASTER")) {
      newBadge = "FULL SYSTEM MASTER";
    }

    if (newBadge) {
      badges.push(newBadge);
      State.update({ activeBadges: badges });
      Terminal.log(`BADGE SECURED: [${newBadge}]`, "SEC");
      Audio.playSuccess();
      Voice.speak(`You earned the ${newBadge.toLowerCase()}.`);
    }
  }

  /**
   * Resets the body tags compiled during assessment
   */
  reset() {
    Object.values(this.classesMap).forEach(cls => {
      document.body.classList.remove(cls);
    });
    Particles.setEnabled(false);
    Audio.stopAmbientHum();
  }
}

export const UnlockEngine = new UnlockCompiler();
export default UnlockEngine;
