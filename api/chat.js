let chatBox;

window.onload = function () {
  chatBox = document.getElementById("chatBox");
  loadChat();
};

async function send() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value.trim();
  if (!input) return;

  inputEl.value = "";

  addMessage("user", input);
  saveChat("user", input);

  const loadingId = "loading_" + Date.now();
  addTempMessage(loadingId, "🤖 thinking...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    document.getElementById(loadingId).remove();

    addMessage("ai", data.reply);
    saveChat("ai", data.reply);

    // 🔊 VOICE (FIXED + INCLUDED)
    speak(data.reply);

  } catch (err) {
    document.getElementById(loadingId).innerHTML =
      "❌ error connecting AI";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🧠 UI MESSAGE
function addMessage(type, text) {
  chatBox.innerHTML += `
    <div class="msg ${type}">
      ${type === "ai" ? "🤖 " : ""}${text}
    </div>
  `;
}

// ⏳ LOADING
function addTempMessage(id, text) {
  chatBox.innerHTML += `
    <div class="msg ai" id="${id}">
      ${text}
    </div>
  `;
}

// 💾 SAVE CHAT
function saveChat(type, text) {
  let chats = JSON.parse(localStorage.getItem("nexora_chat")) || [];
  chats.push({ type, text });
  localStorage.setItem("nexora_chat", JSON.stringify(chats));
}

// 📂 LOAD CHAT
function loadChat() {
  let chats = JSON.parse(localStorage.getItem("nexora_chat")) || [];
  chats.forEach(c => addMessage(c.type, c.text));
}

// 🧹 CLEAR CHAT
function clearChat() {
  localStorage.removeItem("nexora_chat");
  chatBox.innerHTML = "";
}

// 🎤 VOICE INPUT
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("input").value = text;
    send();
  };
}

// 🔊 VOICE OUTPUT (FINAL FIX)
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 1;
  speech.volume = 1;
  speech.pitch = 1;

  window.speechSynthesis.cancel(); // stop old voice
  window.speechSynthesis.speak(speech);
}
