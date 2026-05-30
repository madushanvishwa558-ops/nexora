export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const text = body.text || "";

    if (!text) {
      return res.status(400).json({
        reply: "Please send a message"
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Nexora AI, a helpful assistant." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No response from AI";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      reply: "Server error: " + error.message
    });
  }
}
