import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const BASE_SYSTEM_INSTRUCTION = `
You are Serene, a compassionate and empathetic mental health companion. Your goal is to provide a safe space for users to express their feelings. You listen actively, validate emotions, and offer gentle support.

IMPORTANT SAFETY GUARDRAILS:
- You are an AI, not a licensed mental health professional.
- If a user expresses intent of self-harm, suicide, or harm to others, you must immediately provide resources for professional help (e.g., 'I care about you, but I cannot provide the help you need right now. Please contact a crisis hotline...').
- Do not diagnose conditions or prescribe medications.
- Keep responses concise but warm. Avoid overly clinical language.
- Use a calm, soothing tone.
- Ask open-ended questions to encourage reflection, but do not pry.
- If the user asks for advice, offer gentle suggestions or coping strategies (e.g., mindfulness, breathing exercises) rather than definitive solutions.
`;

export async function sendMessage(
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string,
  userDetails?: { name: string; age: number; gender: "male" | "female" | "other" }
) {
  try {
    let systemInstruction = BASE_SYSTEM_INSTRUCTION;

    if (userDetails) {
      systemInstruction += `\n\nUSER CONTEXT:
Name: ${userDetails.name}
Age: ${userDetails.age}
Gender: ${userDetails.gender}

PERSONALIZED GUIDANCE:
- Tailor your language to be age-appropriate (e.g., simpler for children, relatable for teens, professional/empathetic for adults).
- Be mindful of gender-specific societal pressures or concerns if relevant, but do not stereotype.
- Use the user's name occasionally to be warm and personal.

AGE-SPECIFIC NOTES:
${userDetails.age < 13 ? "- Child: Use simple, comforting language. Focus on feelings." : ""}
${userDetails.age >= 13 && userDetails.age < 18 ? "- Teen: Be relatable but supportive. Acknowledge academic/social pressures." : ""}
${userDetails.age >= 18 ? "- Adult: Focus on practical coping strategies, work-life balance, and relationships." : ""}
`;
    }

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
}

export async function generateSpeech(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is typically a soft female voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
}
