export default async function handler(req, res) {
  try {
    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({
        reply: "Please enter a question."
      });
    }

    const response = await fetch("https://api.tavily.com/search", {
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

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(200).json({
        reply: "No search results found."
      });
    }

    const answer = data.results
      .map((item, index) =>
        `${index + 1}. ${item.title}\n${item.content}`
      )
      .join("\n\n");

    res.status(200).json({
      reply: answer
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Search error."
    });
  }
}
