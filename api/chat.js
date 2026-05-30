export default function handler(req, res) {
  const { text } = req.body;

  // simple AI demo reply
  const reply = "Nexora AI says: " + text;

  res.status(200).json({ reply });
}
