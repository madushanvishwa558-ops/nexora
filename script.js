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

  // USER message
  addMessage("user", input);

  // save
  saveChat("user", input);

  // loading
  const loadingId = "loading_" + Date.now();
  addTempMessage(loadingId, "🤖 thinking...");

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
    addMessage("ai", data.reply);
    saveChat("ai", data.reply);

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

// 👉 Add message to UI
function addMessage(type, text) {
  chatBox.innerHTML += `
    <div class="msg ${type}">
      ${type === "ai" ? "🤖 " : ""}${text}
    </div>
  `;
}

// 👉 Temporary message (loading)
function addTempMessage(id, text) {
  chatBox.innerHTML += `
    <div class="msg ai" id="${id}">
      ${text}
    </div>
  `;
}

// 👉 Save chat to localStorage
function saveChat(type, text) {
  let chats = JSON.parse(localStorage.getItem("nexora_chat")) || [];
  chats.push({ type, text });
  localStorage.setItem("nexora_chat", JSON.stringify(chats));
}

// 👉 Load chat from localStorage
function loadChat() {
  let chats = JSON.parse(localStorage.getItem("nexora_chat")) || [];

  chats.forEach(c => {
    addMessage(c.type, c.text);
  });
}

// 🎤 Voice input
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

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("input").value = text;
    send();
  };
}

// 🧹 Optional: clear chat
function clearChat() {
  localStorage.removeItem("nexora_chat");
  chatBox.innerHTML = "";
}
