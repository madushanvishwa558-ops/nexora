export default async function handler(req, res) {
  try {
    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({ reply: "No input found." });
    }

    // 1. Tavily Search
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
      return res.json({ reply: "No results found." });
    }

    // 2. Extract clean text only (NO LINKS, NO IMAGES)
    let context = searchData.results
      .map(r => `${r.title}. ${r.content}`)
      .join("\n");

    // 3. Simple AI-style summary (NO OpenAI needed)
    const reply = summarize(text, context);

    return res.json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ reply: "Error occurred." });
  }
}


// 🧠 Simple summarizer engine (FREE AI STYLE)
function summarize(query, context) {
  const sentences = context
    .split(".")
    .filter(s => s.length > 40)
    .slice(0, 5);

  return `🤖 About "${query}":\n\n` + sentences.join(". ") + ".";
}
