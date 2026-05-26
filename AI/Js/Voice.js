// Voice Synthesis Gate Module for Quizzora_v2
// Integrates HTML5 SpeechSynthesis API with a robust queue manager to prevent overlaps

class VoiceSystem {
  constructor() {
    this.synth = window.speechSynthesis;
    this.queue = [];
    this.isSpeaking = false;
  }

  /**
   * Pushes text to the speaking queue. If interrupt is true, clears queue and speaks instantly.
   * @param {string} text 
   * @param {function} onStart 
   * @param {function} onEnd 
   * @param {boolean} interrupt 
   */
  speak(text, onStart = null, onEnd = null, interrupt = false) {
    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 1000);
      return;
    }

    if (interrupt) {
      this.synth.cancel();
      this.queue = [];
      this.isSpeaking = false;
    }

    this.queue.push({ text, onStart, onEnd });
    this.processQueue();
  }

  processQueue() {
    if (this.isSpeaking || this.queue.length === 0 || !this.synth) return;
    
    this.isSpeaking = true;
    const task = this.queue.shift();

    const utterance = new SpeechSynthesisUtterance(task.text);
    
    // Attempt to find a premium male/female robotic sounding English voice
    const voices = this.synth.getVoices();
    const desiredVoice = voices.find(voice => 
      voice.lang.includes("en") && (voice.name.includes("Google") || voice.name.includes("Natural") || voice.name.includes("Zira") || voice.name.includes("David"))
    ) || voices[0];
    
    if (desiredVoice) {
      utterance.voice = desiredVoice;
    }
    
    utterance.rate = 1.05; // Slightly faster to sound crisp
    utterance.pitch = 0.9;  // Slightly lower to sound robotic/commanding
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (task.onStart) task.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (task.onEnd) task.onEnd();
      this.processQueue(); // Process next in queue
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      this.isSpeaking = false;
      if (task.onEnd) task.onEnd();
      this.processQueue();
    };

    this.synth.speak(utterance);
  }

  /**
   * Speaks the system rules and triggers a callback when complete
   */
  speakRules(onStart, onEnd) {
    const rulesText = 
      "Welcome Candidate. You are initializing the AI Diagnostic. Here are the rules. " +
      "Correct answers compile the operating system node structures and unlock visual modules. " +
      "Wrong answers move you forward, but fail to synchronize the corresponding sub-systems. " +
      "You have twenty diagnostic nodes to solve. Perfect execution triggers core ascension. " +
      "Begin authentication.";
    
    this.speak(rulesText, onStart, onEnd, true);
  }

  speakReactorAscension(onEnd) {
    this.speak(
      "Congratulations candidate. You have achieved full core ascension. Your cognitive map is now fully compiled.", 
      null, 
      onEnd, 
      true
    );
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.queue = [];
    this.isSpeaking = false;
  }
}

// Pre-load voices (Chrome requires this listener)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}

export const Voice = new VoiceSystem();
export default Voice;
