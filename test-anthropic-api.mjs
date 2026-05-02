import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// Load .env.local manually
const envPath = ".env.local";
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    envVars[key] = value;
  }
});

const api_key = envVars.ANTHROPIC_API_KEY;

if (!api_key) {
  console.log("❌ ANTHROPIC_API_KEY not found in .env.local");
  process.exit(1);
}

console.log("✓ API key found");
console.log(`✓ Key starts with: ${api_key.substring(0, 10)}...`);

const client = new Anthropic({ apiKey: api_key });
console.log("✓ Anthropic client initialized");

try {
  console.log("\n⏳ Testing API connection...\n");
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: "Say 'API is working' in exactly one sentence.",
      },
    ],
  });

  console.log("✅ API TEST PASSED\n");
  console.log("Response:", message.content[0].type === 'text' ? message.content[0].text : 'non-text response');
  console.log("\nDetails:");
  console.log(`  Model: ${message.model}`);
  console.log(`  Stop reason: ${message.stop_reason}`);
  console.log(`  Usage: ${message.usage.input_tokens} input, ${message.usage.output_tokens} output`);
} catch (error) {
  console.error("\n❌ API TEST FAILED");
  console.error("Error:", error.message);
  if (error.status) {
    console.error(`HTTP Status: ${error.status}`);
  }
  if (error.error) {
    console.error("API Error Details:", JSON.stringify(error.error, null, 2));
  }
  process.exit(1);
}
