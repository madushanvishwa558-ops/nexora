function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    document.getElementById("input").value = text;
    send();
  };
}
