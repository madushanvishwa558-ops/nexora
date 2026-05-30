export default function handler(req, res) {
  try {
    const body = req.body || {};
    const text = body.text || "empty";

    res.status(200).json({
      reply: "Nexora AI: " + text
    });

  } catch (error) {
    res.status(500).json({
      reply: "Server error"
    });
  }
}
