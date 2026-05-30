export default async function handler(req, res) {
  const { text } = req.body;

  res.status(200).json({
    reply: "AI: " + text
  });
}
