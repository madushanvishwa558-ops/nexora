async function send() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value;

  if (!input) return;

  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += "<p><b>You:</b> " + input + "</p>";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: input })
  });

  const data = await res.json();

  chatBox.innerHTML += "<p><b>AI:</b> " + data.reply + "</p>";

  // 🔊 AI speaks
  const speech = new SpeechSynthesisUtterance(data.reply);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);

  inputEl.value = "";
}

// 🎤 VOICE INPUT
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported in this browser");
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
