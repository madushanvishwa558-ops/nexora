async function send() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value.trim();

  if (!input) return;

  const chatBox = document.getElementById("chatBox");

  // USER MESSAGE
  chatBox.innerHTML += `<div class="msg user">You: ${input}</div>`;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    // AI MESSAGE
    chatBox.innerHTML += `<div class="msg ai">🤖 ${data.reply}</div>`;

    // 🔊 AI SPEAK
    const speech = new SpeechSynthesisUtterance(data.reply);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);

  } catch (err) {
    chatBox.innerHTML += `<div class="msg ai">AI: error connecting server</div>`;
  }

  inputEl.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}


// 🎤 VOICE INPUT
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported (use Chrome)");
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
