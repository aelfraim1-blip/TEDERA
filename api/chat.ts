import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." } as any);
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { message, healthData, conversationHistory } = body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A valid message string is required." } as any);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is missing on the server. Please configure GEMINI_API_KEY in your Vercel Project Settings -> Environment Variables.",
      } as any);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are the TEDERA Public Health Intelligence System (TPHIS) AI Health Assistant for Koronadal City.
Your role is to assist public health officers, epidemiologists, local government officials, and community members in understanding disease analytics, case projections, positivity rates, and community risk indexes for Koronadal City barangays (including Barangay Mambucal, Barangay Paraiso, Barangay Zone IV, and others).

Real-time TPHIS Health Context:
${healthData ? JSON.stringify(healthData, null, 2) : "No context provided"}

Key Risk Calculation Formula details:
- Composite Risk Index (0-100) = Historical Disease Burden (35%) + Projected Growth (35%) + Positivity Rate (20%) + Community Size factor (10%).
- Risk Categories: VERY HIGH (90-100), HIGH (70-89), MODERATE (40-69), LOW (0-39).
- Projection Assumption: Standard 5% annual baseline growth rate model.

Response Guidelines:
1. Provide accurate, professional, empathetic, and evidence-based answers.
2. Structure responses using clean Markdown (headers, bullet points, bold key figures).
3. When asked for advice or recommendations, provide actionable multi-stage interventions (immediate 0-30 days, short-term 1-6 months, long-term 6+ months) focusing on water sanitation, hygiene education, disease surveillance, and community-based interventions.
4. Keep responses clear and easy to read.`;

    let promptText = "";
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const formattedHistory = conversationHistory
        .map((msg: { role: string; content: string }) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n\n");
      promptText = `Prior Conversation History:\n${formattedHistory}\n\nCurrent User Query: ${message}`;
    } else {
      promptText = message;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "No response text generated from Gemini.";

    return res.status(200).json({ reply: replyText } as any);
  } catch (error: any) {
    console.error("Error in Vercel /api/chat Gemini processing:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate AI response from Gemini.",
    } as any);
  }
}
