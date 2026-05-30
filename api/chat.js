export default function handler(req, res) {
  const { text } = req.body || {};
  const msg = (text || "").toLowerCase();

  let reply = "🤔 I didn't understand that.";

  // greetings
  if (msg.includes("hello") || msg.includes("hi")) {
    reply = "👋 Hello! I am Nexora Smart AI Assistant.";
  }

  // time
  else if (msg.includes("time")) {
    reply = "⏰ Current time: " + new Date().toLocaleTimeString();
  }

  // date
  else if (msg.includes("date")) {
    reply = "📅 Today: " + new Date().toLocaleDateString();
  }

  // name
  else if (msg.includes("your name")) {
    reply = "🤖 I am Nexora AI Assistant (Free Version).";
  }

  // help
  else if (msg.includes("help")) {
    reply = "💡 Try: time, date, hello, your name";
  }

  res.status(200).json({ reply });
}
