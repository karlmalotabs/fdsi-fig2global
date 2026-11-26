// Surgical-precision icon module: fdsi-surfing-wave (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b-38-surfing-wave",
  slug: "surfing-wave",
  name: "#38. Surfing / Water Sports (Zero Wave Bleed — Clean Masked Surfboard + 2 Wave Crests)",
  area: "sb",
  order: 71,
  desc: "FIXED WAVE BLEED: Surfboard hull is cleanly clipped/masked above the top wave crest (zero lines bleeding through the waves!) and separated by a 1.8px padding gap in Solid.",
  meta: {
      "slug": "surfing-wave",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "WSL World Surf League and Olympic surfing heat and event markets.",
      "tags": [
          "surfing",
          "surfboard",
          "wave",
          "ocean",
          "water-sports",
          "wsl"
      ]
  },
  build: ({ s }) => {
      const boardFull = `M6.2 18.0A13.5 13.5 0 0 1 18.8 3.4A13.5 13.5 0 0 1 12.6 18.8Z`;
      const centerFinLine = `M18.8 3.4L9.6 16.2`;
      const wave1 = `M3.0 16.8C5.4 14.8 8.2 14.8 10.6 16.8C13.0 18.8 15.8 18.8 18.2 16.8C19.2 16.0 20.2 15.8 21.0 16.4`;
      const wave2 = `M4.2 20.2C6.6 18.4 9.4 18.4 11.8 20.2C14.2 22.0 17.0 22.0 19.4 20.2`;
      // Mask everything below wave1 (plus a contour-hugging stroke halo around wave1) so the surfboard NEVER bleeds through wave1!
      const waveClipBlock = `M0 16.8C5.4 14.8 8.2 14.8 10.6 16.8C13.0 18.8 15.8 18.8 18.2 16.8L24 16.4V24H0Z`;
      const uidSw = "sw6_" + (nextUid());
      const lineM = `<defs><mask id="${uidSw}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>` +
                    `<path d="${waveClipBlock}" fill="#000"/>` +
                    `<path d="${wave1}" fill="none" stroke="#000" stroke-width="${f(s * 2.1)}" stroke-linecap="round"/></mask></defs>` +
                    `<g mask="url(#${uidSw})"><path d="${boardFull}"/><path d="${centerFinLine}"/></g>` +
                    `<path d="${wave1}"/><path d="${wave2}"/>`;
      const solidCutM = `<defs><mask id="${uidSw}s" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>` +
                        `<path d="${waveClipBlock}" fill="#000"/>` +
                        `<path d="${wave1}" fill="none" stroke="#000" stroke-width="${f(s * 2.4)}" stroke-linecap="round"/></mask></defs>`;
      // For Solid mode, pass `waveClipBlock` in `holeExact` and `wave1` in `knocks` so the solid surfboard is cleanly trimmed 1.8px above wave1!
      return {
        keylines: drawKeylines([], [[18.8, 3.4], [6.8, 15.6], [12.4, 16.8]]),
        line: lineM,
        solid: {
          fill: [boardFull],
          holeExact: [waveClipBlock],
          knocks: [wave1],
          stroke: [wave1, wave2]
        },
        duotone: { tone: [boardFull], secondary: [wave1, wave2], line: lineM }
      };
    }
};
