// Procedural Audio Synthesizer Module for Quizzora_v2
// Synthesizes sci-fi sound effects using pure Web Audio API nodes

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.reactorGain = null;
    this.reactorOscs = [];
    this.isHumming = false;
    this.unlocked = false; // Becomes true when audio is unlocked (Phase 8)
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.unlocked = true;
  }

  // Play a click sound - loud and tactile
  playClick() {
    this.init();
    if (!this.unlocked) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Play a short typing tick sound
  playTick() {
    this.init();
    if (!this.unlocked) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(3000, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  // Play boot sound - rising sci-fi scale
  playBoot() {
    this.init();
    if (!this.unlocked) return;

    const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.01);
      gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  }

  // Play success sound - beautiful major-third arpeggio chime
  playSuccess() {
    this.init();
    if (!this.unlocked) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      
      // Add delay node for premium feel
      const delay = this.ctx.createDelay();
      delay.delayTime.value = 0.15;
      const delayGain = this.ctx.createGain();
      delayGain.gain.value = 0.4;
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      // Delay feedback loop
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.8);
    });
  }

  // Play failure sound - low detuned mechanical error drone
  playFailure() {
    this.init();
    if (!this.unlocked) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc1.type = "sawtooth";
    osc2.type = "sawtooth";
    
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.linearRampToValueAtTime(60, now + 0.5);
    
    osc2.frequency.setValueAtTime(121.5, now);
    osc2.frequency.linearRampToValueAtTime(61.5, now + 0.5);
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(100, now + 0.5);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start();
    osc2.start();
    
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  }

  // Play unlock sound - holographic digital chime sweep
  playUnlock() {
    this.init();
    if (!this.unlocked) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.4);
    
    filter.type = "peaking";
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.4);
    filter.Q.value = 10;
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.6);
  }

  // Play transition sound - filtered swooshing wind
  playTransition() {
    this.init();
    if (!this.unlocked) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(500, now + 0.3);
    
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(1200, now + 0.2);
    filter.frequency.linearRampToValueAtTime(200, now + 0.4);
    filter.Q.value = 5;
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.45);
  }

  // Start background ambient hum
  startAmbientHum() {
    this.init();
    if (!this.unlocked || this.isHumming) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz low A note
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    
    this.ambientOsc = osc;
    this.ambientGain = gain;
    this.isHumming = true;
  }

  // Stop background ambient hum
  stopAmbientHum() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
      } catch (e) {}
      this.ambientOsc = null;
    }
    this.isHumming = false;
  }

  // Start reactor hum and trigger dynamic volume/pitch swell for Phase 20
  startReactorSwell() {
    this.init();
    if (!this.unlocked) return;
    
    this.stopAmbientHum(); // Silence the normal hum

    const now = this.ctx.currentTime;
    
    // Core low hum
    const oscCore = this.ctx.createOscillator();
    oscCore.type = "sine";
    oscCore.frequency.setValueAtTime(60, now);
    
    // Higher vibrating rings (detuned saws)
    const oscRing1 = this.ctx.createOscillator();
    const oscRing2 = this.ctx.createOscillator();
    
    oscRing1.type = "sawtooth";
    oscRing1.frequency.setValueAtTime(120, now);
    oscRing1.detune.setValueAtTime(-10, now);
    
    oscRing2.type = "sawtooth";
    oscRing2.frequency.setValueAtTime(120, now);
    oscRing2.detune.setValueAtTime(10, now);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(80, now);
    // Swelling filter frequency upwards dynamically
    filter.frequency.exponentialRampToValueAtTime(800, now + 4);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.02, now);
    // Swelling volume dynamically
    gain.gain.linearRampToValueAtTime(0.25, now + 4);
    
    // Pitch vibration (LFO)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 6; // 6Hz vibration
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 5; // vibrate detune of saw waves
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscRing1.detune);
    lfoGain.connect(oscRing2.detune);
    
    oscCore.connect(filter);
    oscRing1.connect(filter);
    oscRing2.connect(filter);
    
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    oscCore.start();
    oscRing1.start();
    oscRing2.start();
    lfo.start();
    
    this.reactorOscs = [oscCore, oscRing1, oscRing2, lfo];
    this.reactorGain = gain;
  }

  // Stop reactor swell
  stopReactor() {
    this.reactorOscs.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.reactorOscs = [];
    if (this.reactorGain) {
      try {
        this.reactorGain.disconnect();
      } catch (e) {}
      this.reactorGain = null;
    }
  }
}

export const Audio = new AudioSystem();
export default Audio;
