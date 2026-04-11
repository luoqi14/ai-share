import { NextResponse } from "next/server";

export async function GET() {
  const top20Models = [
    { rank: 1, name: "claude-opus-4-6-thinking", elo: 1504, lab: "Anthropic" },
    { rank: 2, name: "gemini-3.1-pro-preview", elo: 1492, lab: "Google" },
    { rank: 3, name: "muse-spark", elo: 1487, lab: "Meta" },
    { rank: 4, name: "grok-4.20-beta1", elo: 1486, lab: "xAI" },
    { rank: 5, name: "gpt-5.4-high", elo: 1484, lab: "OpenAI" },
    { rank: 6, name: "glm-5.1", elo: 1471, lab: "Z.ai" },
    { rank: 7, name: "qwen3.5-max-preview", elo: 1466, lab: "Alibaba" },
    { rank: 8, name: "dola-seed-2.0-pro", elo: 1462, lab: "Bytedance" },
    { rank: 9, name: "kimi-k2.5-thinking", elo: 1452, lab: "Moonshot" },
    { rank: 10, name: "ernie-5.0-0110", elo: 1450, lab: "Baidu" },
    { rank: 11, name: "mimo-v2-pro", elo: 1447, lab: "Xiaomi" },
    { rank: 12, name: "longcat-flash-chat-exp", elo: 1441, lab: "Meituan" },
    { rank: 13, name: "amazon-nova-chat", elo: 1427, lab: "Amazon" },
    { rank: 14, name: "deepseek-v3.2-exp-thinking", elo: 1425, lab: "DeepSeek" },
    { rank: 15, name: "mistral-large-3", elo: 1415, lab: "Mistral" },
    { rank: 16, name: "minimax-m2.7", elo: 1404, lab: "MiniMax" },
    { rank: 17, name: "hunyuan-vision-1.5-thinking", elo: 1397, lab: "Tencent" },
    { rank: 18, name: "mai-1-preview", elo: 1393, lab: "Microsoft AI" },
    { rank: 19, name: "step-3.5-flash", elo: 1391, lab: "StepFun" },
    { rank: 20, name: "trinity-large", elo: 1375, lab: "Arcee AI" },
  ];

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    data: top20Models,
  });
}
