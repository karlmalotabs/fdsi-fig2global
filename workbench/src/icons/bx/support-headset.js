// Surgical-precision icon module: fdsi-support-headset (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { arcPath, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-19-support-headset",
  slug: "support-headset",
  name: "#19. Customer Support / Live Chat Headset (Headband Arc + 2 Padded Earcups + Mic Boom)",
  area: "bx",
  order: 52,
  desc: "Semicircular headband arc (cx=12, cy=12, R=7.8) + Left & Right bloated earcup pills (w=3.8, h=6.4) + curved bottom-right microphone boom to (13.0, 20.4).",
  meta: {
      "slug": "support-headset",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "24/7 customer support, live chat agent, and player helpdesk.",
      "tags": [
          "support",
          "headset",
          "helpdesk",
          "customer-service",
          "live-chat",
          "agent",
          "contact"
      ]
  },
  build: ({ b, r }) => {
      const band = arcPath(12.0, 11.5, 7.8, 180, 360);
      const earL = bloatRect({ x: 3.2, y: 10.5, w: 3.8, h: 6.4, r: Math.min(r * 0.6, 1.5), b: b * 0.3 });
      const earR = bloatRect({ x: 17.0, y: 10.5, w: 3.8, h: 6.4, r: Math.min(r * 0.6, 1.5), b: b * 0.3 });
      const mic = `M19.0 16.8V18.0A2.4 2.4 0 0 1 16.6 20.4H12.2`;
      return {
        keylines: drawKeylines([[12, 11.5, 7.8]], [...earL.anchors, ...earR.anchors, [12.2, 20.4]]),
        line: `<path d="${band}"/><path d="${earL.d}"/><path d="${earR.d}"/><path d="${mic}"/>`,
        solid: {
          face: [earL.d, earR.d],
          stroke: [band, mic]
        },
        duotone: { tone: [earL.d, earR.d], secondary: [band, mic], line: `<path d="${band}"/><path d="${earL.d}"/><path d="${earR.d}"/><path d="${mic}"/>` }
      };
    }
};
