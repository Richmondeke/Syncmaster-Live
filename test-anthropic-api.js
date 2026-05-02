import Anthropic from "@anthropic-ai/sdk";

const api_key = process.env.ANTHROPIC_API_KEY;

if (!api_key) {
  console.log("❌ ANTHROPIC_API_KEY not set in environment");
  process.exit(1);
}

console.log("✓ API key found");
console.log(`✓ Key starts with: ${api_key.substring(0, 10)}...`);

const client = new Anthropic({ apiKey: api_key });
console.log("✓ Anthropic client initialized");

try {
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

  console.log("\n✅ API TEST PASSED");
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
  process.exit(1);
}
