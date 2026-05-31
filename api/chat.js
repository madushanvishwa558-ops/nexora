export default async function handler(req, res) {
  try {
    console.log("API HIT");

    const { text } = req.body || {};
    console.log("USER TEXT:", text);

    if (!text) {
      return res.json({ reply: "No input" });
    }

    const searchRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: text,
        search_depth: "basic",
        max_results: 3
      })
    });

    console.log("TAVILY STATUS:", searchRes.status);

    const data = await searchRes.json();
    console.log("TAVILY DATA:", data);

    if (!data.results) {
      return res.json({
        reply: "No results OR API failed"
      });
    }

    const textData = data.results
      .map(r => r.content || "")
      .join(" ");

    return res.json({
      reply: "OK: " + textData.slice(0, 200)
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      reply: "Backend crash: check logs"
    });
  }
}
