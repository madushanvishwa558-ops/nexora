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

    // auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `<div class="msg ai">AI: error connecting server</div>`;
  }

  inputEl.value = "";
}
