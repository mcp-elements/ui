export async function getGitHubStars(repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!res.ok) return 0
    const data = (await res.json()) as { stargazers_count?: number }
    return data.stargazers_count ?? 0
  } catch {
    return 0
  }
}
