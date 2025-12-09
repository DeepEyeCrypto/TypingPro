import { GoogleGenAI } from "@google/genai";
import { Lesson } from "../types";

const createClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const generateSmartLesson = async (focusedKeys: string[], difficulty: 'easy' | 'medium' | 'hard'): Promise<Lesson | null> => {
    const ai = createClient();
    if (!ai) {
        console.warn("API Key not found for Gemini.");
        return null;
    }

    const model = 'gemini-2.5-flash';
    const keysStr = focusedKeys.join(', ');
    
    // Construct prompt
    let prompt = `Create a typing practice lesson content string.
    The content should ONLY contain the following characters: ${keysStr} and Space.
    Do not use any other characters.
    The difficulty is ${difficulty}.
    
    For 'easy', use simple repetitive patterns like "faf jaj".
    For 'medium', use pseudo-words or real words if possible given the keys.
    For 'hard', use complex patterns and longer sequences.
    
    The output should be a single plain text string of approximately 300 characters.
    Do not include markdown or explanations. Just the text.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 400,
            }
        });

        const text = response.text?.trim() || "";
        
        // Fallback validation: if the AI returned nothing, don't crash
        if (text.length < 10) return null;

        return {
            id: Date.now(),
            title: `Smart Practice: ${focusedKeys.slice(0, 3).join('')}...`,
            description: "AI-generated lesson tailored to these keys.",
            keys: focusedKeys,
            content: text,
            isAiGenerated: true
        };

    } catch (error) {
        console.error("Failed to generate lesson:", error);
        return null;
    }
};