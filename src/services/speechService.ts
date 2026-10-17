// Speech Service providing Speech-to-Text (STT) and Text-to-Speech (TTS)
// Designed for Indian gig workers who prefer listening and speaking over small screen typing

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static recognitionInstance: any = null;
  private static isSpeakingNow = false;

  /**
   * Check if Speech Recognition is supported in the browser
   */
  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Start listening to voice input in Hindi or English/Hinglish
   */
  public static startListening(
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    lang: string = 'hi-IN'
  ): () => void {
    if (!this.isRecognitionSupported()) {
      onError('Speech recognition not supported in this browser. Please type or use preset audio.');
      return () => {};
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      this.recognitionInstance = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang; // 'hi-IN' or 'en-IN'
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onResult(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          onError(`Mic error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        this.recognitionInstance = null;
        onEnd();
      };

      recognition.start();

      return () => {
        try {
          recognition.abort();
        } catch (_) {}
      };
    } catch (e: any) {
      onError(e.message || 'Failed to start microphone');
      return () => {};
    }
  }

  /**
   * Stop speech recognition
   */
  public static stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch (_) {}
      this.recognitionInstance = null;
    }
  }

  /**
   * Speak out text in simple Hindi / Indian English voice (TTS)
   * Essential for low-literacy or on-bike workers (WCAG accessibility)
   */
  public static speak(text: string, onEnd?: () => void): void {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any previous speech
    this.stopSpeaking();

    // Clean text of markdown asterisks and URLs for natural speech
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/₹/g, 'rupaye ')
      .slice(0, 350); // Keep voice summary concise and punchy

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick best available voice (Hindi or Indian English or default)
    const voices = this.synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    const indianEngVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));

    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else if (indianEngVoice) {
      utterance.voice = indianEngVoice;
      utterance.lang = 'en-IN';
    } else {
      utterance.lang = 'hi-IN';
    }

    utterance.rate = 0.95; // Slightly slower, very clear
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.isSpeakingNow = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingNow = false;
      if (onEnd) onEnd();
    };

    this.isSpeakingNow = true;
    this.synth.speak(utterance);
  }

  /**
   * Stop any current speech playback
   */
  public static stopSpeaking(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }
    this.isSpeakingNow = false;
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingNow;
  }

  /**
   * Play an accessible notification chime using Web Audio API
   */
  public static playChime(type: 'success' | 'alert' | 'pop' = 'pop'): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (_) {
      // Ignore audio context errors silently
    }
  }
}
