import { GitHubClient } from "../src/main/github-client";

/** Ad-hoc real-network smoke test for GitHubClient's read path — no token needed for public repos. */
async function main() {
  const client = new GitHubClient({ token: "", owner: "octocat", repo: "Hello-World" });
  let failures = 0;

  // 1. getFileContent on a real, known file.
  const readme = await client.getFileContent("README", "master");
  assert(readme !== null, "README should be found");
  assert(!!readme && readme.length > 0, "README content should be non-empty");
  console.log(`[ok] getFileContent README (${readme?.length} chars): ${JSON.stringify(readme?.slice(0, 40))}...`);

  // 2. getFileContent on a path that does not exist -> must resolve to null, not throw.
  const missing = await client.getFileContent("this/path/does/not/exist.svg", "master");
  assert(missing === null, "missing file should resolve to null");
  console.log("[ok] getFileContent 404 -> null");

  // 3. getFileJson against a real JSON file in a different, larger public repo.
  const jsonClient = new GitHubClient({ token: "", owner: "expressjs", repo: "express" });
  const pkg = await jsonClient.getFileJson<{ name: string }>("package.json", "master");
  assert(pkg !== null && pkg.name === "express", `package.json name should be "express", got ${pkg?.name}`);
  console.log(`[ok] getFileJson package.json -> name="${pkg?.name}"`);

  console.log(failures === 0 ? "\nAll GitHubClient read checks passed." : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);

  function assert(condition: boolean, message: string) {
    if (!condition) {
      failures++;
      console.error(`[FAIL] ${message}`);
    }
  }
}

main().catch((err) => {
  console.error("Script errored:", err);
  process.exit(1);
});
