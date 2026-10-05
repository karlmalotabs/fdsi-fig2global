import { strict as assert } from "node:assert";
import { test } from "node:test";
import { toFigmaSvg, toRepoSvg } from "../src/main/svg-translate";

// Shape of a real Figma export (fdsi-live): luminance mask with white fill, artwork filled black.
const figmaExport =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<mask id="m" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">\n' +
  '<path d="M0 0H24V24H0V0Z" fill="white"/>\n<path d="M1 1H5V5H1V1Z" fill="black"/>\n</mask>\n' +
  '<g mask="url(#m)">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M6 0L7 1Z" fill="black"/>\n' +
  '<path d="M2 2L3 3Z" stroke="#000" stroke-width="2" fill="#000000"/>\n</g>\n</svg>';

test("toRepoSvg turns black paints into currentColor but leaves masks and other attributes alone", () => {
  const out = toRepoSvg(figmaExport, "solid");
  assert.ok(out.includes('d="M6 0L7 1Z" fill="currentColor"'));
  assert.ok(out.includes('stroke="currentColor" stroke-width="2" fill="currentColor"'));
  assert.ok(out.includes('<path d="M0 0H24V24H0V0Z" fill="white"/>'));
  assert.ok(out.includes('<path d="M1 1H5V5H1V1Z" fill="black"/>'), "paints inside <mask> must stay literal");
  assert.ok(out.includes('fill="none"'));
  assert.ok(out.includes('fill-rule="evenodd"'));
  assert.ok(!out.includes('d="M6 0L7 1Z" fill="black"'));
});

test("toRepoSvg leaves multi-colour icons untouched", () => {
  assert.equal(toRepoSvg(figmaExport, "color"), figmaExport);
});

test("toFigmaSvg turns currentColor into black, outside masks only", () => {
  const repo =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)">' +
    '<path fill="currentColor" d="M0 0"/><path stroke="currentColor" d="M1 1"/></g>' +
    '<mask id="m"><path fill="currentColor" d="M2 2"/></mask></svg>';
  const out = toFigmaSvg(repo, "outline");
  assert.ok(out.includes('<path fill="black" d="M0 0"/>'));
  assert.ok(out.includes('<path stroke="black" d="M1 1"/>'));
  assert.ok(out.includes('<mask id="m"><path fill="currentColor" d="M2 2"/></mask>'));
  assert.equal(toFigmaSvg(repo, "color"), repo);
});

test("translation is idempotent and round-trips paint values", () => {
  const once = toRepoSvg(figmaExport, "solid");
  assert.equal(toRepoSvg(once, "solid"), once);
  const back = toFigmaSvg(once, "solid");
  assert.equal(toFigmaSvg(back, "solid"), back);
  assert.equal(toRepoSvg(back, "solid"), once);
});
