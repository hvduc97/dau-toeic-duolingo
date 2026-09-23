// Web Audio API Synthesizer - Không phụ thuộc file mp3 ngoài, chạy tức thì mọi nơi!

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dau_sound_enabled");
      this.soundEnabled = saved !== null ? saved === "true" : true;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("dau_sound_enabled", String(this.soundEnabled));
    }
    if (this.soundEnabled) {
      this.playCorrect();
    }
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("dau_sound_enabled", String(enabled));
    }
  }

  // Âm thanh "Ding" vui nhộn kiểu Duolingo khi trả lời đúng
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  // Âm thanh báo nhẹ khi chọn sai
  public playIncorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.25); // D3

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Nhạc ăn mừng hoàn thành xuất sắc bài thi
  public playFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, duration: 0.18 }, // C major
      { notes: [587.33, 739.99, 880.0], time: 0.2, duration: 0.18 }, // D major
      { notes: [659.25, 830.61, 987.77], time: 0.4, duration: 0.18 }, // E major
      { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.65, duration: 0.7 }, // G major chord
    ];

    chords.forEach((chord) => {
      chord.notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + chord.time);

        gain.gain.setValueAtTime(0.001, now + chord.time);
        gain.gain.exponentialRampToValueAtTime(0.12, now + chord.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + chord.time);
        osc.stop(now + chord.time + chord.duration);
      });
    });
  }

  // Web Speech API phát âm tiếng Anh chuẩn xác
  public speakEnglish(text: string, rate: number = 0.9): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = rate;

      // Ưu tiên chọn giọng tiếng Anh tự nhiên nếu có
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(
        (v) => (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha")) && v.lang.startsWith("en")
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const soundManager = new SoundManager();
