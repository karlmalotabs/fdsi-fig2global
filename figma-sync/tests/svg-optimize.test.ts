import { strict as assert } from "node:assert";
import { test } from "node:test";
import { optimizeSvg } from "../src/main/svg-optimize";

const input =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<mask id="mask0_1_72" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">\n' +
  '<path d="M0 0H24V24H0V0Z" fill="white"/>\n</mask>\n' +
  '<g mask="url(#mask0_1_72)">\n<path d="M15.666 17.666C15.8649 17.666 16.0557 17.745 16.1963 17.8857Z" fill="currentColor"/>\n</g>\n</svg>';

test("optimizeSvg shrinks the SVG but keeps currentColor, viewBox and the luminance mask", () => {
  const out = optimizeSvg(input);
  assert.ok(out.length < input.length);
  assert.ok(out.includes('fill="currentColor"'));
  assert.ok(out.includes('viewBox="0 0 24 24"'));
  assert.ok(out.includes("<mask"));
  assert.ok(/mask="url\(#[^)]+\)"/.test(out));
});

test("optimizeSvg returns the input when it cannot be parsed", () => {
  assert.equal(optimizeSvg("<svg><path"), "<svg><path");
});
