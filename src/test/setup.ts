import '@testing-library/jest-dom';

// Mock Web Speech API SpeechSynthesis
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: () => {},
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      getVoices: () => [],
    },
    writable: true
  });

  // Mock AudioContext
  (window as any).AudioContext = class {
    createOscillator() {
      return {
        connect: () => {},
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        start: () => {},
        stop: () => {}
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
      };
    }
    get destination() {
      return {};
    }
    get currentTime() {
      return 0;
    }
  };

  // Mock scrollIntoView
  Element.prototype.scrollIntoView = () => {};
}
