import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

export const PROJECT_ROOT = path.resolve(__dirname, "../..");

export const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-opus-4-8";

export function readProjectFile(relativePath: string): string {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Archivo no encontrado: ${fullPath}`);
  }
  return fs.readFileSync(fullPath, "utf-8");
}

export function readProjectFileOrNull(relativePath: string): string | null {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf-8");
}

export function readSystemPrompt(agentName: string): string {
  return readProjectFile(`docs/agents/${agentName}.md`);
}

export function listSpecFiles(relativeDir: string): string[] {
  const fullDir = path.join(PROJECT_ROOT, relativeDir);
  if (!fs.existsSync(fullDir)) return [];

  const results: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".spec.ts")) {
        results.push(path.relative(PROJECT_ROOT, fullPath).replace(/\\/g, "/"));
      }
    }
  }

  walk(fullDir);
  return results;
}

export async function askClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 8000
): Promise<string> {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const response = await stream.finalMessage();

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

export function writeReport(filename: string, content: string): void {
  const reportsDir = path.join(PROJECT_ROOT, "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  const filepath = path.join(reportsDir, filename);
  fs.writeFileSync(filepath, content, "utf-8");
  console.log(`\nReporte guardado en: reports/${filename}`);
}
