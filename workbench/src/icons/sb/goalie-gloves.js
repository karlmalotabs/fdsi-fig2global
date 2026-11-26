// Surgical-precision icon module: fdsi-goalie-gloves (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-127-goalie-gloves",
  slug: "goalie-gloves",
  name: "#127. Goalkeeper Saves / Clean Sheet (Open-Palm Goalie Glove — 5 Rounded Fingers + Palm + Cuff)",
  area: "sb",
  order: 160,
  desc: "Built using our approved #33 MMA Glove Multi-Shape Solid architecture: Open-palm goalkeeper glove with 4 vertical finger capsules + angled thumb + bloated palm pad + wrist strap!",
  meta: {
      "slug": "goalie-gloves",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Clean sheet (team to win to nil) and goalkeeper total saves markets.",
      "tags": [
          "goalkeeper",
          "gloves",
          "clean-sheet",
          "saves",
          "keeper",
          "shutout"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      // Line mode: Open-palm goalkeeper glove with 4 tall fingers (y=3.2..9.4), side thumb at left (x=3.0..6.8), palm (x=6.8..19.2, y=9.4..15.6), and wrist cuff (y=15.6..20.4):
      const fingersLine =
        `M6.8 9.4V4.8A1.35 1.35 0 0 1 9.5 4.8V9.4` +
        `M9.7 9.4V3.8A1.4 1.4 0 0 1 12.5 3.8V9.4` +
        `M12.7 9.4V4.2A1.4 1.4 0 0 1 15.5 4.2V9.4` +
        `M15.7 9.4V5.4A1.35 1.35 0 0 1 18.4 5.4V9.4`;
      const palmLine =
        `M6.8 9.4H18.4A1.2 1.2 0 0 1 19.6 10.6V14.2A1.6 1.6 0 0 1 18.0 15.8H7.2` +
        `C5.0 15.8 3.2 14.0 3.2 11.6` +
        `A1.5 1.5 0 0 1 6.0 10.8L6.8 12.0Z`;
      const cuffLine = `M7.2 15.8V18.8A1.6 1.6 0 0 0 8.8 20.4H16.4A1.6 1.6 0 0 0 18.0 18.8V15.8`;

      // Solid mode: 7 Independent Padded Shapes (4 Finger Pills + Separate Thumb Pill + Main Palm Pad + Lower Wrist Cuff — ZERO knockouts!):
      const f1 = bloatRect({ x: 6.6,  y: 3.8, w: 2.5, h: 4.8, r: 0.95, b: 0.12 });
      const f2 = bloatRect({ x: 9.9,  y: 2.8, w: 2.5, h: 5.8, r: 0.95, b: 0.12 });
      const f3 = bloatRect({ x: 13.2, y: 3.2, w: 2.5, h: 5.4, r: 0.95, b: 0.12 });
      const f4 = bloatRect({ x: 16.5, y: 4.4, w: 2.4, h: 4.2, r: 0.95, b: 0.12 });
      const thumb = capsule(4.2, 10.4, 5.4, 14.2, 1.35);
      const palmSolid = bloatRect({ x: 7.2, y: 9.8, w: 12.0, h: 5.6, r: 1.5, b: 0.18 + b * 0.3 });
      const cuffSolid = bloatRect({ x: 7.2, y: 16.8, w: 11.2, h: 3.6, r: [0.9, 0.9, cr, cr], b: 0.15 + b * 0.3 });

      return {
        keylines: drawKeylines([], [...palmSolid.anchors, ...cuffSolid.anchors]),
        line: `<path d="${palmLine}"/><path d="${fingersLine}"/><path d="${cuffLine}"/>`,
        solid: {
          face: [f1.d, f2.d, f3.d, f4.d, thumb, palmSolid.d, cuffSolid.d]
        },
        duotone: {
          tone: [palmSolid.d],
          secondary: [fingersLine, cuffLine],
          line: `<path d="${palmLine}"/><path d="${fingersLine}"/><path d="${cuffLine}"/>`
        }
      };
    }
};
