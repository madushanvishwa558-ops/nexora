async function send() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value.trim();

  if (!input) return;

  const chatBox = document.getElementById("chatBox");

  // User message
  chatBox.innerHTML += `
    <div class="msg user">
      ${input}
    </div>
  `;

  inputEl.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: input
      })
    });

    const data = await res.json();

    // AI message
    chatBox.innerHTML += `
      <div class="msg ai">
        🤖 ${data.reply}
      </div>
    `;

    // AI voice output
    const speech = new SpeechSynthesisUtterance(data.reply);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);

  } catch (error) {
    chatBox.innerHTML += `
      <div class="msg ai">
        ❌ Error connecting to server
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}


// Voice Input
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input not supported. Use Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;

    document.getElementById("input").value = text;

    send();
  };

  recognition.onerror = function(error) {
    console.log(error);
  };
}
