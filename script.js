async function send() {
  const inputEl = document.getElementById("input");
  const input = inputEl.value;

  console.log("clicked:", input);

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

  inputEl.value = "";
}
