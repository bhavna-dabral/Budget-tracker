import { useState } from "react";
import axios from "axios";

export const useAI = () => {
  const [aiInsights, setAIInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInsights = async (incomes, expenses) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/ai-insights", {
        incomes,
        expenses,
      });

      setAIInsights(res.data.insights);
    } catch (err) {
      setAIInsights("Failed to load AI insights");
    }
    setLoading(false);
  };

  return { aiInsights, fetchInsights, loading };
};