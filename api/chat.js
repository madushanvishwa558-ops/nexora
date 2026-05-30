export default function handler(req, res) {
  const { text } = req.body || {};

  let reply = "I didn't understand that.";

  const msg = (text || "").toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    reply = "👋 Hello! I am Nexora AI Assistant.";
  }
  else if (msg.includes("name")) {
    reply = "🤖 I am Nexora AI (Free Mode).";
  }
  else if (msg.includes("time")) {
    reply = "⏰ " + new Date().toLocaleTimeString();
  }
  else if (msg.includes("date")) {
    reply = "📅 " + new Date().toLocaleDateString();
  }
  else if (msg.includes("help")) {
    reply = "Try: hello, time, date, name";
  }

  res.status(200).json({ reply });
}
