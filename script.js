async function send() {
  let text = document.getElementById("input").value;

  let res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  let data = await res.json();

  document.getElementById("output").innerText = data.reply;
}
