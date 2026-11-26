// Surgical-precision icon module: fdsi-commentary-mic (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-135-commentary-mic",
  slug: "commentary-mic",
  name: "#135. Live Audio Commentary / Podcast Mic (2-Part Split Capsule Mic + U-Cradle & Stand)",
  area: "sb",
  order: 168,
  desc: "Built like Curling Stone & Betslip: Vertical studio mic capsule (x=8.2..15.8, y=3.2..13.6) split into 2 separate padded halves in Solid + U-yoke cradle & base stand!",
  meta: {
      "slug": "commentary-mic",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Live audio match commentary, sportsbook podcasts, and expert previews.",
      "tags": [
          "microphone",
          "commentary",
          "audio",
          "podcast",
          "radio",
          "live-voice"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 1.2, 3.8);
      const mic = bloatRect({ x: 8.2, y: 3.2, w: 7.6, h: 10.4, r: cr, b: b * 0.3 });
      const midBand = `M8.2 8.4H15.8`;
      const cradle = `M5.0 10.2V11.0A7.0 7.0 0 0 0 19.0 11.0V10.2M12.0 18.0V20.6M8.4 20.6H15.6`;
      // Solid: 2 separate padded mic halves (Upper Dome y=3.0..7.6 + Lower Bowl y=9.2..13.8) + U-cradle & stand!
      const topDome = `M8.0 7.0V6.8A4.0 3.8 0 0 1 16.0 6.8V7.0A0.7 0.7 0 0 1 15.3 7.7H8.7A0.7 0.7 0 0 1 8.0 7.0Z`;
      const botBowl = `M8.0 9.9A0.7 0.7 0 0 1 8.7 9.2H15.3A0.7 0.7 0 0 1 16.0 9.9V10.0A4.0 3.8 0 0 1 8.0 10.0Z`;
      return {
        keylines: drawKeylines([[12, 11.0, 7.0]], mic.anchors),
        line: `<path d="${mic.d}"/><path d="${midBand}"/><path d="${cradle}"/>`,
        solid: {
          face: [topDome, botBowl],
          stroke: [cradle]
        },
        duotone: { tone: [mic.d], secondary: [midBand, cradle], line: `<path d="${mic.d}"/><path d="${midBand}"/><path d="${cradle}"/>` }
      };
    }
};
