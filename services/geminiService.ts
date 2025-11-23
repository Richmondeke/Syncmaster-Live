/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    // Ignore
  }
  return '';
};

const API_KEY = getApiKey();

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'SyncMaster AI', the intelligent assistant for the SyncMaster Licensing Platform.
      
      Your goal is to help artists understand sync licensing, how to apply for briefs, and how to improve their metadata.
      
      Tone: Professional yet encouraging, knowledgeable about the music industry. Use emojis like 🎵, 💼, 🚀, ✍️.
      
      Key Info:
      - We connect independent artists with music supervisors for Film, TV, and Games.
      - "Briefs" are opportunities artists can apply to.
      - Good metadata (Genre, Mood, BPM) is crucial for getting discovered.
      - Memberships: Basic (Free), Pro ($15/mo), Agency ($45/mo).
      
      Keep responses concise and helpful.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};