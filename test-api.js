import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: ".env.local" });

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testAPI() {
  try {
    console.log("API Key loaded:", process.env.ANTHROPIC_API_KEY ? "✓" : "✗");
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Say 'API works!' in one sentence.",
        },
      ],
    });
    console.log("✓ API works!");
    console.log("Response:", message.content[0].type === 'text' ? message.content[0].text : 'No text');
  } catch (error) {
    console.error("✗ API error:", error.message);
    process.exit(1);
  }
}

testAPI();
