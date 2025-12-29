class AudioService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn("AudioContext not supported or failed to initialize", e);
      return null;
    }
  }

  playSelect() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // High blip
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playMove() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    // "Pop" sound
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }
  
  playInvalid() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Low buzz
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // C Major Arpeggio (C4, E4, G4, C5)
    const notes = [261.63, 329.63, 392.00, 523.25];
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const startTime = now + (i * 0.15);
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }
}

export const audio = new AudioService();