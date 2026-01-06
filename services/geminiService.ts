
import { GoogleGenAI, Type } from "@google/genai";
import { OracleResult } from "../types";

export const generateProphecy = async (topic: string, timeline: string): Promise<OracleResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `You are the Aether Oracle, a mystical entity with deep knowledge of history and current global trends. 
  A seeker asks about the future of: "${topic}" over the next ${timeline}.
  
  Use your knowledge of historical patterns (like economic cycles, technological booms, social movements) and current events (via Google Search) to craft a series of "prophesies".
  
  Your response must be in Markdown format, but specifically structured to be parsed. 
  Include:
  1. A mystical, atmospheric introduction.
  2. A list of 3-5 specific predictions/prophesies. Each should have:
     - A timeframe (e.g., "In 3 months", "By the first winter")
     - A title
     - A detailed description written in an evocative, oracular style but based on logical trends.
     - A "Historical Echo" explaining the precedent for this event.
     - A probability percentage.
  3. A concluding mystical warning about the fluidity of time.
  
  IMPORTANT: This is for entertainment purposes only. Do not provide medical, legal, or financial advice.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.8,
      },
    });

    const text = response.text || "The stars are obscured... I cannot see.";
    
    // Extract search grounding sources
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    // Since we need to parse this somewhat structured text, let's guide the model to be clear 
    // or manually parse it. For simplicity and robustness in this demo, 
    // we'll return the full text and sources, and let the UI handle the markdown rendering.
    // In a production app, we'd use responseSchema to get clean JSON.
    
    return {
      introduction: text, // In this implementation, we'll treat the whole thing as one flow
      predictions: [], // We'll render the MD directly
      conclusion: "",
      sources: sources
    };
  } catch (error) {
    console.error("Error generating prophecy:", error);
    throw new Error("The cosmic connection was severed. Please try again when the alignment improves.");
  }
};
