import { optimize } from "svgo/browser";

/** Shrinks Figma's verbose export; run after toRepoSvg so `currentColor` is already in place. Falls back to the input on any failure. */
export function optimizeSvg(svg: string): string {
  try {
    const result = optimize(svg, {
      multipass: true,
      plugins: ["preset-default"],
    });
    return result.data.includes("<svg") ? result.data : svg;
  } catch {
    return svg;
  }
}
