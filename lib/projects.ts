import fs from "node:fs/promises";
import path from "node:path";

export async function getProjectContent(slug: string): Promise<string> {
  const file = path.join(process.cwd(), "content", "projects", `${slug}.md`);
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return `## Coming soon\n\nCase study for **${slug}** is being written.`;
  }
}
