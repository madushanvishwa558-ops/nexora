async function send() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value.trim();
  if (!input) return;

  const chatBox = document.getElementById("chatBox");

  // USER MESSAGE
  chatBox.innerHTML += `<div class="msg user">${input}</div>`;
  inputEl.value = "";

  // ⏳ LOADING MESSAGE
  const loadingId = "loading_" + Date.now();
  chatBox.innerHTML += `<div class="msg ai" id="${loadingId}">🤖 thinking...</div>`;

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    // remove loading
    document.getElementById(loadingId).remove();

    // AI message
    chatBox.innerHTML += `<div class="msg ai">🤖 ${data.reply}</div>`;

    // voice
    const speech = new SpeechSynthesisUtterance(data.reply);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);

  } catch (err) {
    document.getElementById(loadingId).innerHTML =
      "❌ error connecting AI";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
