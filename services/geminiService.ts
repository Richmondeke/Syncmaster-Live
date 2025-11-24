/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ResearchResult } from "../types";

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

export const searchSyncDatabase = async (query: string): Promise<ResearchResult | null> => {
  if (!API_KEY) {
    console.error("API Key missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search for detailed soundtrack and music placement information for "${query}".
      
      I need structured data for a database display. Please output ONLY valid JSON matching this structure:
      {
        "subject": "Name of the movie/show/song found",
        "type": "Movie" | "TV Show" | "Song",
        "year": "Release Year (e.g. 2022)",
        "imageUrl": "A direct URL to a poster image or album cover (must end in .jpg, .png, or .webp). Prefer Wikipedia/Wikimedia upload.wikimedia.org URLs or standard movie poster database URLs if found. If no valid image source is found, return null.",
        "results": [
          {
             "title": "Song Title (if searching a movie) or Movie/Show Title (if searching a song)",
             "artist": "Artist Name (if searching a movie) or empty string (if searching a song)",
             "bpm": "Tempo in BPM (estimate if needed)",
             "genre": "Genre of the track",
             "description": "Short description of the scene where it plays or context",
             "timestamp": "Time code if available (e.g. 10:23), else empty"
          }
        ]
      }
      
      Do not include markdown code blocks (like \`\`\`json). Just return the raw JSON string. Ensure the JSON is valid.`,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is not allowed with googleSearch tool
      },
    });

    let text = response.text || "{}";
    // Clean up any markdown formatting if the model adds it despite instructions
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }

    return JSON.parse(text) as ResearchResult;
  } catch (error) {
    console.error("Sync Search Error:", error);
    return null;
  }
};
