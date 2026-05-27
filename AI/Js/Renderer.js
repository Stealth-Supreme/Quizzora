// UI Rendering and DOM Manipulation Engine for Quizzora_v2
// Orchestrates landing, decrypt sequences, option interactions, feedback shakes, and final dashboards

import { State } from "./State.js";
import { QuizEngine } from "./QuizEngine.js";
import { UnlockEngine } from "./UnlockEngine.js";
import { Audio } from "./Audio.js";
import { Voice } from "./Voice.js";
import { Reactor } from "./Reactor.js";
import { wait, scrambleText } from "./Utils.js";
import { CheatState } from "./Cheat.js";
import { Terminal } from "./Terminal.js";

class UIRenderer {
  constructor() {
    this.screens = {};
    this.activeQuestionText = null;
    this.choicesContainer = null;
    this.enableVoiceBtn = null;
    this.startAssessmentBtn = null;
    this.restartBtn = null;
  }

  /**
   * Caches all main screen containers and main buttons
   */
  init() {
    this.screens = {
      landing: document.getElementById("screen-landing"),
      reveal: document.getElementById("screen-reveal"),
      quiz: document.getElementById("screen-quiz"),
      results: document.getElementById("screen-results")
    };
    
    this.enableVoiceBtn = document.getElementById("btn-enable-voice");
    this.startAssessmentBtn = document.getElementById("btn-start-assessment");
    
    this.activeQuestionText = document.getElementById("active-question-text");
    this.choicesContainer = document.getElementById("choices-container");
    
    this.restartBtn = document.getElementById("btn-restart");

    this.bindGlobalEvents();
  }

  /**
   * Binds user triggers to audio clicks
   */
  bindGlobalEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest(".choice-card")) {
        Audio.playClick();
      }
    });
  }

  /**
   * Show landing screen and handle voice gate clicks
   */
  showLanding() {
    this.switchScreen("landing");
    
    if (this.startAssessmentBtn) {
      this.startAssessmentBtn.classList.add("hidden");
    }

    if (this.enableVoiceBtn) {
      this.enableVoiceBtn.addEventListener("click", () => {
        this.enableVoiceBtn.disabled = true;
        this.enableVoiceBtn.classList.add("btn-voice-active");
        this.enableVoiceBtn.textContent = "SYNCHRONIZING RULES VOICE...";
        
        State.update({ voiceEnabled: true });
        Audio.init();
        Audio.playBoot();

        Voice.speakRules(
          () => {
            State.update({ status: "SPEAKING RULES..." });
          },
          () => {
            State.update({ rulesSpoken: true });
            this.enableVoiceBtn.textContent = "VOICE GATE SYNCHRONIZED";
            this.enableVoiceBtn.classList.remove("btn-voice-active");
            this.enableVoiceBtn.classList.add("btn-voice-success");
            
            if (this.startAssessmentBtn) {
              this.startAssessmentBtn.classList.remove("hidden");
              this.startAssessmentBtn.classList.add("animate-fade-in");
            }
          }
        );
      });
    }
  }

  switchScreen(screenName) {
    Object.keys(this.screens).forEach(name => {
      if (name === screenName) {
        this.screens[name].classList.remove("hidden");
        this.screens[name].classList.add("active");
      } else {
        this.screens[name].classList.add("hidden");
        this.screens[name].classList.remove("active");
      }
    });
  }

  async triggerCinematicReveal() {
    this.switchScreen("reveal");
    State.update({ isDecrypting: true });

    const decEl = document.getElementById("reveal-decrypt");
    const authEl = document.getElementById("reveal-auth");
    const rendEl = document.getElementById("reveal-render");

    decEl.textContent = "";
    authEl.textContent = "";
    rendEl.textContent = "";

    Audio.playTransition();

    await scrambleText(decEl, "DECRYPTING NODE COCKPIT STRUCTURES...", 600, () => Audio.playTick());
    await wait(300);

    await scrambleText(authEl, "AUTHENTICATING PROMPT PROTOCOLS...", 600, () => Audio.playTick());
    await wait(300);

    await scrambleText(rendEl, "RENDERING INTELLECTUAL QUESTION FIELD...", 600, () => Audio.playTick());
    await wait(400);

    State.update({ isDecrypting: false });
    this.renderActiveQuestion();
  }

  async renderActiveQuestion() {
    this.switchScreen("quiz");
    const currentQ = QuizEngine.getCurrentQuestion();
    
    if (!currentQ) return;

    this.choicesContainer.innerHTML = "";

    // Cheat: e4e5
    let qText = currentQ.text;
    if (CheatState.e4e5) {
      const pieces = ["♔", "♕", "♖", "♗", "♘", "♙"];
      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      qText = `${piece} ${qText}`;
    }

    if (State.phase >= 11) {
      await scrambleText(this.activeQuestionText, qText, 1000, () => Audio.playTick());
    } else {
      await scrambleText(this.activeQuestionText, qText, 500, () => Audio.playTick());
    }

    // Cheat: civillian_18
    if (CheatState.civillian_18) {
      let skipBtn = document.getElementById("skip-btn-dev");
      if (!skipBtn) {
        skipBtn = document.createElement("button");
        skipBtn.id = "skip-btn-dev";
        skipBtn.className = "glow-cyber-btn";
        skipBtn.style.position = "absolute";
        skipBtn.style.top = "25px";
        skipBtn.style.right = "25px";
        skipBtn.style.zIndex = "999";
        skipBtn.style.padding = "8px 16px";
        skipBtn.style.fontSize = "0.75rem";
        skipBtn.style.fontFamily = "var(--font-hud)";
        skipBtn.style.letterSpacing = "2px";
        skipBtn.style.background = "rgba(0, 0, 0, 0.8)";
        skipBtn.style.border = "1px solid var(--accent-color)";
        skipBtn.style.color = "var(--accent-color)";
        skipBtn.style.boxShadow = "0 0 10px rgba(0, 240, 255, 0.2)";
        skipBtn.style.borderRadius = "4px";
        skipBtn.style.cursor = "pointer";
        skipBtn.textContent = "SKIP (DEV)";
        skipBtn.addEventListener("click", () => this.handleSkip());
        document.getElementById("screen-quiz").appendChild(skipBtn);
      } else {
        skipBtn.style.pointerEvents = "auto";
        skipBtn.style.display = "block";
      }
    } else {
      const skipBtn = document.getElementById("skip-btn-dev");
      if (skipBtn) skipBtn.style.display = "none";
    }

    currentQ.options.forEach((optText, index) => {
      const card = document.createElement("div");
      card.className = "choice-card";
      
      const numSpan = document.createElement("span");
      numSpan.className = "choice-num";
      numSpan.textContent = `0${index + 1}`;
      card.appendChild(numSpan);

      const textSpan = document.createElement("span");
      textSpan.className = "choice-text";
      textSpan.textContent = optText;
      card.appendChild(textSpan);

      // Cheat: genius
      if (CheatState.genius) {
        setTimeout(() => {
          if (!card.classList.contains("choice-success") && !card.classList.contains("choice-failure")) {
            textSpan.style.transition = "opacity 2s ease";
            textSpan.style.opacity = "0";
            numSpan.style.transition = "opacity 2s ease";
            numSpan.style.opacity = "0";
          }
        }, 5000);
      }

      card.addEventListener("mousemove", (e) => {
        if (State.phase < 5) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const angleX = (yc - y) / 10;
        const angleY = (x - xc) / 10;
        card.style.transform = `perspective(500px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.03)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)";
      });

      card.addEventListener("click", () => this.handleChoiceSelect(index, card));

      this.choicesContainer.appendChild(card);
    });
  }

  async handleChoiceSelect(idx, cardEl) {
    const allCards = this.choicesContainer.querySelectorAll(".choice-card");
    allCards.forEach(c => c.style.pointerEvents = "none");

    const isCorrect = QuizEngine.submitAnswer(idx);

    if (isCorrect) {
      cardEl.classList.add("choice-success");
      Audio.playSuccess();

      if (State.phase >= 16) {
        this.triggerCelebrationRipple(cardEl);
      }
    } else {
      cardEl.classList.add("choice-failure");
      Audio.playFailure();

      if (State.phase >= 12) {
        const board = document.getElementById("screen-quiz");
        board.classList.add("feedback-shake");
        setTimeout(() => board.classList.remove("feedback-shake"), 500);
      }
    }

    await UnlockEngine.evaluateUnlock();
    await wait(1500);

    const hasNext = QuizEngine.advance();
    
    // MID QUIZ VOICE TRIGGERS
    if (State.currentQuestionIndex === 1) {
      Voice.speak("Afterward, questions are made by Divyam.");
    } else if (State.currentQuestionIndex === 11) {
      Voice.speak("Afterward, questions are made by Yuvraj.");
    } else if (State.currentQuestionIndex === 13) {
      Voice.speak("Afterward, questions are made by the Developer himself. Total respect.");
    }

    if (State.currentQuestionIndex === 10) {
      await this.triggerVirusEvent();
    }

    if (State.currentQuestionIndex === 19 && State.virusIgnored) {
      await this.triggerCrashEvent();
    }

    if (hasNext) {
      this.triggerCinematicReveal();
    } else {
      this.renderFinalDashboard();
    }
  }

  async handleSkip() {
    const allCards = this.choicesContainer.querySelectorAll(".choice-card");
    allCards.forEach(c => c.style.pointerEvents = "none");
    const skipBtn = document.getElementById("skip-btn-dev");
    if (skipBtn) skipBtn.style.pointerEvents = "none";

    const currentQ = QuizEngine.getCurrentQuestion();
    if (currentQ) {
      QuizEngine.submitAnswer(currentQ.correctIndex); // skip = score yes
      await UnlockEngine.evaluateUnlock(); // skip = unlock yes
      await wait(1000);
    }
    
    const hasNext = QuizEngine.advance();
    
    // MID QUIZ VOICE TRIGGERS
    if (State.currentQuestionIndex === 1) {
      Voice.speak("Afterward, questions are made by Divyam.");
    } else if (State.currentQuestionIndex === 11) {
      Voice.speak("Afterward, questions are made by Yuvraj.");
    } else if (State.currentQuestionIndex === 13) {
      Voice.speak("Afterward, questions are made by the Developer himself. Total respect.");
    }
    
    if (State.currentQuestionIndex === 10) {
      await this.triggerVirusEvent();
    }

    if (State.currentQuestionIndex === 19 && State.virusIgnored) {
      await this.triggerCrashEvent();
    }

    if (hasNext) {
      this.triggerCinematicReveal();
    } else {
      this.renderFinalDashboard();
    }
  }

  async triggerVirusEvent() {
    return new Promise(resolve => {
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0"; modal.style.left = "0"; modal.style.width = "100%"; modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0,0,0,0.9)";
      modal.style.zIndex = "999";
      modal.style.display = "flex";
      modal.style.flexDirection = "column";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      
      modal.innerHTML = `
        <h1 style="color: #ff3333; font-family: var(--font-hud); letter-spacing: 2px; text-shadow: 0 0 10px red;">SYSTEM SECURITY ALERT</h1>
        <div style="margin-top: 20px; display: flex; gap: 20px;">
          <button id="btn-virus-check" class="glow-cyber-btn" style="background:#00f0ff;">Check for a virus</button>
          <button id="btn-virus-ignore" class="glow-cyber-btn" style="background:#333; color:#fff;">Ignore</button>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("btn-virus-check").addEventListener("click", async () => {
        document.getElementById("btn-virus-check").disabled = true;
        document.getElementById("btn-virus-ignore").disabled = true;
        State.virusIgnored = false;
        
        const terms = [
          "Checking system folders...", "Scanning browser cache...", 
          "Inspecting diagnostic modules...", "Threat signature detected...", 
          "Engaging countermeasures...", "Neutralizing malicious payload...", 
          "Repairing corrupted sectors...", "Verifying cleanup...", 
          "System integrity restored...", "PC is safe."
        ];
        
        for(let term of terms) {
          Terminal.log(term, "AV");
          await wait(1000); // 10 seconds total roughly
        }
        modal.remove();
        resolve();
      });

      document.getElementById("btn-virus-ignore").addEventListener("click", () => {
        State.virusIgnored = true;
        modal.remove();
        resolve();
      });
    });
  }

  async triggerCrashEvent() {
    const crash = document.createElement("div");
    crash.style.position = "fixed";
    crash.style.top = "0"; crash.style.left = "0"; crash.style.width = "100%"; crash.style.height = "100%";
    crash.style.backgroundColor = "#ff0000";
    crash.style.color = "#ffffff";
    crash.style.zIndex = "1000";
    crash.style.display = "flex";
    crash.style.flexDirection = "column";
    crash.style.alignItems = "center";
    crash.style.justifyContent = "center";
    crash.style.fontFamily = "var(--font-hud)";
    crash.innerHTML = `
      <h1 style="font-size: 3rem; margin-bottom: 20px;">SYSTEM FAILURE</h1>
      <h2 style="font-size: 1.5rem; margin-bottom: 10px;">UNAUTHORIZED THREAT ESCALATION</h2>
      <h2 style="font-size: 1.5rem;">CORE SERVICES CORRUPTED</h2>
    `;
    document.body.appendChild(crash);
    Voice.speak("System failure. Threat escalation. Corrupted sectors detected.", null, null, true);
    await wait(3000);
    crash.innerHTML = `<h1>RECOVERING SERVICES...</h1>`;
    await wait(2000);
    crash.remove();
  }

  async triggerRickRoll() {
    const prank = document.createElement("div");
    prank.style.position = "fixed";
    prank.style.top = "0"; prank.style.left = "0"; prank.style.width = "100%"; prank.style.height = "100%";
    prank.style.backgroundColor = "#000";
    prank.style.zIndex = "9999";
    prank.style.display = "flex";
    prank.style.alignItems = "center";
    prank.style.justifyContent = "center";
    prank.style.color = "#fff";
    prank.style.fontSize = "2rem";
    prank.style.fontFamily = "var(--font-hud)";
    document.body.appendChild(prank);

    prank.innerHTML = `<div>I love someone</div>`;
    await wait(5000);
    prank.innerHTML = `<div>I love someone<br/>...........</div>`;
    await wait(1500);
    
    prank.innerHTML = `<iframe width="100%" height="100%" src="https://youtube.com/shorts/Ay8lynMZ4mE?si=-c5XtqARWXIDhuKS?autoplay=1&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }

  triggerCelebrationRipple(el) {
    const rip = document.createElement("div");
    rip.className = "celebration-ripple";
    el.appendChild(rip);
    setTimeout(() => rip.remove(), 800);
  }

  async renderFinalDashboard() {
    this.switchScreen("results");
    
    const rankTitleEl = document.getElementById("results-rank");
    const scoreValEl = document.getElementById("results-score-value");
    const reportTextEl = document.getElementById("results-report-text");
    const lockBoxEl = document.getElementById("results-lock-box");
    const perfectSpecEl = document.getElementById("results-perfect-specs");

    scoreValEl.textContent = `${State.score} / 20`;

    let rank = "";
    let color = "";
    if (State.score === 20) {
      rank = "SYNAPSE OVERRIDE SYSTEM MASTER";
      color = "#00f0ff";
    } else if (State.score >= 17) {
      rank = "NEURAL MATRIX ELITE OPERATOR";
      color = "#bd00ff";
    } else if (State.score >= 12) {
      rank = "SECURE HAND OPERATIVE";
      color = "#39ff14";
    } else if (State.score >= 6) {
      rank = "MIDWAY DIAGNOSTICIAN";
      color = "#ffff00";
    } else {
      rank = "RAW NODE RECRUIT";
      color = "#ff3333";
    }

    rankTitleEl.textContent = rank;
    rankTitleEl.style.color = color;

    Terminal.hide();

    const badgeHtml = State.activeBadges.length > 0
      ? State.activeBadges.map(b => `<span class="hud-badge badge-${b.toLowerCase().replace(/\s+/g, "-")}">${b}</span>`).join("")
      : "NONE";

    // Report generation
    reportTextEl.innerHTML = `
      <strong>DIAGNOSTIC PROFILES MATRIX:</strong><br>
      - COMPILATION COMPLETENESS: ${State.phase * 5}%<br>
      - ACCURACY COFFICIENT: ${(State.score / 20) * 100}%<br>
      <div style="margin-top: 10px;"><strong>ACTIVE BADGES SECURED:</strong></div>
      <div class="results-badge-container" style="display:flex; gap:10px; margin-top:5px; flex-wrap:wrap; justify-content:center;">
        ${badgeHtml}
      </div>
    `;

    // Reactor Logic
    if (State.score < 20) {
      lockBoxEl.classList.remove("hidden");
      lockBoxEl.innerHTML = `
        <div class="lock-message glow-red">
          Complete website not unlocked :(
        </div>
        <p class="lock-desc">
          STANDBY FOR DIAGNOSTIC VOICE ANALYSIS.
        </p>
      `;
      perfectSpecEl.classList.add("hidden");

      // Interrupt true for immediate rules stopping
      Voice.speak(
        "You are not a topper like Riyanshi, all 20 questions were not solved, but the developer, sir, is too kind, so you are seeing the downgraded version of the reactor that was meant for elite solvers.",
        null,
        () => {
          // Transition ONLY AFTER voice completes
          Reactor.trigger(true);
        },
        true
      );
    } else {
      lockBoxEl.classList.add("hidden");
      perfectSpecEl.classList.remove("hidden");
      
      await wait(1000);
      Reactor.trigger(false);
    }
  }
}

export const Renderer = new UIRenderer();
export default Renderer;
