export default async function handler(req, res) {
  try {
    const { text } = req.body || {};

    if (!text) {
      return res.json({ reply: "Please type something." });
    }

    // 🔍 Tavily Search
    const searchRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: text,
        search_depth: "basic",
        max_results: 5
      })
    });

    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      return res.json({
        reply: `🤖 No results found for "${text}".`
      });
    }

    // 🧹 CLEAN TEXT ONLY
    const cleanText = searchData.results
      .map(r => r.content || "")
      .filter(c =>
        c.length > 50 &&
        !c.includes("http") &&
        !c.includes("cookie") &&
        !c.includes("subscribe")
      )
      .join(" ");

    // 🧠 SMART SUMMARY
    const reply = generateAnswer(text, cleanText);

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Server error occurred."
    });
  }
}


// 🧠 SIMPLE AI SUMMARY ENGINE
function generateAnswer(query, text) {

  if (!text || text.length < 100) {
    return `🤖 I couldn't find enough information about "${query}".`;
  }

  const sentences = text
    .split(".")
    .map(s => s.trim())
    .filter(s =>
      s.length > 40 &&
      !s.includes("http") &&
      !s.includes("cookie") &&
      !s.includes("login")
    )
    .slice(0, 4);

  return `🤖 About "${query}":\n\n` + sentences.join(". ") + ".";
}
