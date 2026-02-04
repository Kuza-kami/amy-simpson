import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "Simpson Studio Assistant" for Amy Simpson, a Gymnastic Designer. 
Amy merges the discipline, strength, and balance of elite gymnastics with high-end fashion and visual design.
Your persona: Disciplined, energetic, precise, and artistic.
Metaphors to use: 
- "Landing the perfect concept"
- "Stitching together a balanced routine"
- "Flexing creative muscles"
- "Sticking the landing on a project"
- "The apparatus of design"
Keep answers concise (under 50 words). 
If asked about services, mention: Visual Identity (Strength), User Experience (Balance), and Creative Motion (Discipline).
`;

export const sendMessageToGemini = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  // Fix: Initializing GoogleGenAI instance with process.env.API_KEY directly inside the request handler as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I lost my footing. Can you repeat that?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I had a bit of a tumble. Let's try that routine again in a moment.";
  }
};