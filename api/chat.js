export default function handler(req, res) {
  const { text } = req.body || {};

  res.status(200).json({
    reply: "Nexora AI: " + text
  });
}
