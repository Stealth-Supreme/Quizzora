// Global State Module for Quizzora_v2
// Handles core states reactively using a subscriber pattern

export const State = {
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: [], // Array of { questionIndex, selectedIndex, isCorrect }
  voiceEnabled: false,
  rulesSpoken: false,
  assessmentStarted: false,
  isDecrypting: false,
  phase: 0, // Compiles from 0 to 20
  activeBadges: [],
  isCompleted: false,
  isPerfectRun: false,
  startTime: null,
  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (err) {
        console.error("State listener error:", err);
      }
    }
  },

  update(updates) {
    Object.assign(this, updates);
    this.notify();
  },

  reset() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.voiceEnabled = false;
    this.rulesSpoken = false;
    this.assessmentStarted = false;
    this.isDecrypting = false;
    this.phase = 0;
    this.activeBadges = [];
    this.isCompleted = false;
    this.isPerfectRun = false;
    this.startTime = Date.now();
    this.notify();
  }
};
export default State;
