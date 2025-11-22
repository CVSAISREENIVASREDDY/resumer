
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { action, text, context, topic } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        switch (action) {
            case 'improveText':
                const model = 'gemini-2.5-flash';
                const prompt = `
                  You are a professional resume editor. 
                  Context: The user is writing a resume for a Software Engineering or Technical role.
                  Task: Rewrite the following text to be more professional, impactful, and concise. Use action verbs.
                  
                  Context Description: ${context}
                  Original Text: "${text}"
                  
                  Output ONLY the rewritten text. Do not include quotes or explanations.
                `;

                const response = await ai.models.generateContent({
                    model: model,
                    contents: prompt,
                });

                const improvedText = response.text?.trim() || text;
                return res.status(200).json({ success: true, data: improvedText });

            case 'generateContent':
                const genModel = 'gemini-2.5-flash';
                const genPrompt = `
                  Generate a professional resume bullet point for the following topic: "${topic}".
                  Keep it under 20 words. Use strong action verbs.
                  Output ONLY the bullet point.
                `;

                const genResponse = await ai.models.generateContent({
                    model: genModel,
                    contents: genPrompt
                });

                const generatedText = genResponse.text?.trim() || "";
                return res.status(200).json({ success: true, data: generatedText });

            default:
                return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error("Error with Gemini API:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
