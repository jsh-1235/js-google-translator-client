export default class Speaker {
  constructor() {
    this.speech = null;

    this.initialize();
  }

  initialize() {
    if ("speechSynthesis" in window) {
      this.speech = new SpeechSynthesisUtterance();
    } else {
      console.log("Speech Synthesis is not Supported 😞");
    }
  }

  play(lang, message) {
    if ("speechSynthesis" in window) {
      this.speech.lang = lang;
      this.speech.volume = 1; // From 0 to 1
      this.speech.rate = 1; // From 0.1 to 10
      this.speech.pitch = 1; // From 0 to 2
      this.speech.text = message;

      const voices = speechSynthesis.getVoices();
      const voice = voices.find((voice) => voice.default);
      this.speech.voice = voice;

      window.speechSynthesis.speak(this.speech);
    } else {
      console.log("Speech Synthesis is not Supported 😞");
    }
  }
}
