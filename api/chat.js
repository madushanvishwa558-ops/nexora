export default function handler(req, res) {
  const { text } = req.body || {};
  const msg = (text || "").toLowerCase();

  let reply = "🤔 I didn't understand that. Try asking something else.";

  // greetings
  if (msg.includes("hello") || msg.includes("hi")) {
    reply = "👋 Hello! I am Nexora Smart AI. How can I help you today?";
  }

  // name
  else if (msg.includes("your name")) {
    reply = "🤖 My name is Nexora AI (Smart Free Version).";
  }

  // help
  else if (msg.includes("help")) {
    reply = "💡 You can ask me about time, greetings, or simple questions.";
  }

  // time
  else if (msg.includes("time")) {
    reply = "⏰ Current time is: " + new Date().toLocaleTimeString();
  }

  // date
  else if (msg.includes("date")) {
    reply = "📅 Today is: " + new Date().toLocaleDateString();
  }

  // creator
  else if (msg.includes("who made you")) {
    reply = "🧠 I was created by Nexora Labs.";
  }

  res.status(200).json({ reply });
}
