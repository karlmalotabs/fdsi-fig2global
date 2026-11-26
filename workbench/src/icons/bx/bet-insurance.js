// Surgical-precision icon module: fdsi-bet-insurance (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-56-bet-insurance-umbrella",
  slug: "bet-insurance",
  name: "#56. Bet Insurance / Safe Bet (Hemispherical Umbrella Canopy + J-Hook Handle)",
  area: "bx",
  order: 89,
  desc: "Semicircular umbrella dome (cx=12, cy=12.4, R=8.8) with scalloped bottom edge + top finial tip + J-hook handle curving to (9.2, 18.4). Solid: filled canopy dome + J-hook!",
  meta: {
      "slug": "bet-insurance",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Rainy-day stake protection and risk-free bet insurance coverage.",
      "tags": [
          "umbrella",
          "insurance",
          "protection",
          "risk-free",
          "cover",
          "safe",
          "refund"
      ]
  },
  build: () => {
      // Hemispherical canopy from (3.2, 12.2) over top (12.0, 3.4) to (20.8, 12.2) with 3 gentle bottom scallops:
      const canopy =
        `M3.2 12.2` +
        `A8.8 8.8 0 0 1 20.8 12.2` +
        `Q17.9 10.8 15.0 12.2` +
        `Q12.0 10.8 9.0 12.2` +
        `Q6.1 10.8 3.2 12.2Z`;
      const shaft = `M12.0 2.6V3.6M12.0 11.8V18.2A2.0 2.0 0 0 1 8.0 18.2V17.2`;
      return {
        keylines: drawKeylines([[12, 12.2, 8.8]], [[3.2, 12.2], [20.8, 12.2], [12, 18.2], [8.0, 18.2]]),
        line: `<path d="${canopy}"/><path d="${shaft}"/>`,
        solid: {
          fill: [canopy],
          stroke: [shaft]
        },
        duotone: { tone: [canopy], secondary: [shaft], line: `<path d="${canopy}"/><path d="${shaft}"/>` }
      };
    }
};
