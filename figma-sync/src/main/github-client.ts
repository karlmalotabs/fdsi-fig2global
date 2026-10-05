import type { FileChange } from "./types";
import type { TreeEntry } from "./repo-tree";

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
        `/repos/${this.owner}/${this.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}&_=${Date.now()}`,
        { cache: "no-store" }
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

  /** Every path in the branch with its blob id, in one request. */
  async listTree(branch: string): Promise<TreeEntry[]> {
    const data = await this.request<{ tree: TreeEntry[]; truncated: boolean }>(
      `/repos/${this.owner}/${this.repo}/git/trees/${encodeURIComponent(branch)}?recursive=1&_=${Date.now()}`,
      { cache: "no-store" }
    );
    if (data.truncated) throw new Error("The repository tree is too large to list in one request");
    return data.tree;
  }

  private async getBranchHeadSha(branch: string): Promise<string> {
    const data = await this.request<{ object: { sha: string } }>(
      // GitHub serves this with max-age=60; the cache-buster stops a stale head right after Pull's own commit.
      `/repos/${this.owner}/${this.repo}/git/ref/heads/${encodeURIComponent(branch)}?_=${Date.now()}`,
      { cache: "no-store" }
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
    try {
      return await this.commitFilesOnce(branch, message, changes);
    } catch (err) {
      if (err instanceof Error && err.message.includes("not a fast forward")) {
        return this.commitFilesOnce(branch, message, changes);
      }
      throw err;
    }
  }

  private async commitFilesOnce(branch: string, message: string, changes: FileChange[]): Promise<string> {
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

  /** Creates `name` at the current head of `fromBranch`. */
  async createBranch(name: string, fromBranch: string): Promise<void> {
    const sha = await this.getBranchHeadSha(fromBranch);
    await this.request(`/repos/${this.owner}/${this.repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${name}`, sha }),
    });
  }

  async openPullRequest(input: { head: string; base: string; title: string; body: string }): Promise<{ number: number; url: string }> {
    const data = await this.request<{ number: number; html_url: string }>(`/repos/${this.owner}/${this.repo}/pulls`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { number: data.number, url: data.html_url };
  }

  async getPullRequestState(number: number): Promise<"open" | "merged" | "closed"> {
    const data = await this.request<{ state: string; merged: boolean }>(
      `/repos/${this.owner}/${this.repo}/pulls/${number}?_=${Date.now()}`,
      { cache: "no-store" }
    );
    if (data.merged) return "merged";
    return data.state === "open" ? "open" : "closed";
  }
}

/** Manual UTF-8 <-> binary-string conversion — Figma's plugin sandbox has atob/btoa but no TextEncoder/TextDecoder. */
function utf8BytesFromString(text: string): number[] {
  const bytes: number[] = [];
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }
  return bytes;
}

function stringFromUtf8Bytes(bytes: number[]): string {
  let result = "";
  let i = 0;
  while (i < bytes.length) {
    const b0 = bytes[i];
    if (b0 < 0x80) {
      result += String.fromCharCode(b0);
      i += 1;
    } else if ((b0 & 0xe0) === 0xc0) {
      result += String.fromCharCode(((b0 & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else if ((b0 & 0xf0) === 0xe0) {
      result += String.fromCharCode(
        ((b0 & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)
      );
      i += 3;
    } else {
      const codePoint =
        ((b0 & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f);
      result += String.fromCodePoint(codePoint);
      i += 4;
    }
  }
  return result;
}

function encodeBase64Utf8(text: string): string {
  const bytes = utf8BytesFromString(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i++) bytes.push(binary.charCodeAt(i));
  return stringFromUtf8Bytes(bytes);
}
