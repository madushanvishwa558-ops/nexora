export default function handler(req, res) {
  const { text } = req.body || {};

  let reply = "I didn't understand that.";

  const msg = text?.toLowerCase() || "";

  if (msg.includes("hello")) reply = "Hi 👋 I am Nexora Free AI";
  else if (msg.includes("hi")) reply = "Hello! How can I help you?";
  else if (msg.includes("name")) reply = "I am Nexora AI (Free Mode)";
  else if (msg.includes("help")) reply = "You can ask me simple questions.";

  res.status(200).json({ reply });
}
