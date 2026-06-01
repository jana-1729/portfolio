import fallback from "@/content/github-fallback.json";

export type GithubRepo = { name: string; description: string; language: string; stars: number; url: string };
export type GithubData = { user: string; totalContributions: number; topRepos: GithubRepo[] };

export async function getGithub(): Promise<GithubData> {
  const fb = fallback as GithubData;
  try {
    const res = await fetch(`https://api.github.com/users/${fb.user}/repos?sort=updated&per_page=8`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("github api failed");
    const repos = (await res.json()) as Array<{ name: string; description: string | null; language: string | null; stargazers_count: number; html_url: string }>;
    const descByName = new Map(fb.topRepos.map((r) => [r.name, r.description]));
    const merged: GithubRepo[] = repos.slice(0, 4).map((r) => ({
      name: r.name,
      description: (r.description && r.description.trim()) || descByName.get(r.name) || "",
      language: r.language ?? "—",
      stars: r.stargazers_count,
      url: r.html_url,
    }));
    return { user: fb.user, totalContributions: fb.totalContributions, topRepos: merged };
  } catch {
    return fb;
  }
}
