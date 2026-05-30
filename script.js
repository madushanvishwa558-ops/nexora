async function send() {
  console.log("SEND CLICKED");

  const inputEl = document.getElementById("input");
  const input = inputEl.value.trim();

  if (!input) return;

  const chatBox = document.getElementById("chatBox");

  // USER message
  chatBox.innerHTML += `<div>You: ${input}</div>`;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    // AI message
    chatBox.innerHTML += `<div>AI: ${data.reply}</div>`;

  } catch (error) {
    chatBox.innerHTML += `<div>AI: error connecting server</div>`;
  }

  inputEl.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
