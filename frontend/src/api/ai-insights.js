import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAIInsights = async (req, res) => {
  try {
    const { incomes, expenses } = req.body;

    const prompt = `
    Analyze this financial data:
    Income: ${JSON.stringify(incomes)}
    Expenses: ${JSON.stringify(expenses)}

    Give short insights and suggestions.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ insights: response.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ message: "AI error" });
  }
};