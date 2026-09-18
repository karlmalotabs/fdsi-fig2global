import type { FileChange } from "./types";

interface GitHubClientOptions {
  token: string;
  owner: string;
  repo: string;
}

/** Thin wrapper over the GitHub REST + Git Data API used for reads and atomic multi-file commits. */
export class GitHubClient {
  private token: string;
  private owner: string;
  private repo: string;

  constructor(options: GitHubClientOptions) {
    this.token = options.token;
    this.owner = options.owner;
    this.repo = options.repo;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: {
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`GitHub API ${init?.method ?? "GET"} ${path} failed: ${res.status} ${body}`);
    }
    return (await res.json()) as T;
  }

  /** Reads a single file's text content at a ref, or null if it doesn't exist. */
  async getFileContent(path: string, ref: string): Promise<string | null> {
    try {
      const data = await this.request<{ content: string; encoding: string }>(
        `/repos/${this.owner}/${this.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`
      );
      if (data.encoding !== "base64") throw new Error(`Unexpected encoding "${data.encoding}"`);
      return decodeBase64Utf8(data.content);
    } catch (err) {
      if (err instanceof Error && err.message.includes(" 404 ")) return null;
      throw err;
    }
  }

  async getFileJson<T>(path: string, ref: string): Promise<T | null> {
    const text = await this.getFileContent(path, ref);
    return text ? (JSON.parse(text) as T) : null;
  }

  private async getBranchHeadSha(branch: string): Promise<string> {
    const data = await this.request<{ object: { sha: string } }>(
      `/repos/${this.owner}/${this.repo}/git/ref/heads/${encodeURIComponent(branch)}`
    );
    return data.object.sha;
  }

  private async getCommitTreeSha(commitSha: string): Promise<string> {
    const data = await this.request<{ tree: { sha: string } }>(
      `/repos/${this.owner}/${this.repo}/git/commits/${commitSha}`
    );
    return data.tree.sha;
  }

  private async createBlob(content: string): Promise<string> {
    const data = await this.request<{ sha: string }>(
      `/repos/${this.owner}/${this.repo}/git/blobs`,
      { method: "POST", body: JSON.stringify({ content: encodeBase64Utf8(content), encoding: "base64" }) }
    );
    return data.sha;
  }

  /**
   * Stages one atomic commit for every change (adds/modifies/deletes) and fast-forwards
   * `branch` to it. This is the single write primitive used by both Pull's write-back
   * and Push — no partial/broken intermediate commits are ever visible.
   */
  async commitFiles(branch: string, message: string, changes: FileChange[]): Promise<string> {
    const headSha = await this.getBranchHeadSha(branch);
    const baseTreeSha = await this.getCommitTreeSha(headSha);

    const treeEntries = await Promise.all(
      changes.map(async (change) => {
        if (change.delete) {
          return { path: change.path, mode: "100644", type: "blob", sha: null };
        }
        const blobSha = await this.createBlob(change.content ?? "");
        return { path: change.path, mode: "100644", type: "blob", sha: blobSha };
      })
    );

    const treeData = await this.request<{ sha: string }>(
      `/repos/${this.owner}/${this.repo}/git/trees`,
      { method: "POST", body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }) }
    );

    const commitData = await this.request<{ sha: string }>(
      `/repos/${this.owner}/${this.repo}/git/commits`,
      {
        method: "POST",
        body: JSON.stringify({ message, tree: treeData.sha, parents: [headSha] }),
      }
    );

    await this.request(`/repos/${this.owner}/${this.repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commitData.sha, force: false }),
    });

    return commitData.sha;
  }
}

function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
