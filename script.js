async function send() {
  let input = document.getElementById("input").value;

  let chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += "<p><b>You:</b> " + input + "</p>";

  let res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input })
  });

  let data = await res.json();

  chatBox.innerHTML += "<p><b>AI:</b> " + data.reply + "</p>";

  document.getElementById("input").value = "";
}
