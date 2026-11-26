// Surgical-precision icon module: fdsi-share (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { add, sub, mul, norm, P, circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-13-share-nodes",
  slug: "share",
  name: "#13. Share / Send Betslip (3 Connected Nodes + Exact Circle-Edge Link Rays)",
  area: "common",
  order: 46,
  desc: "3 circular nodes at Left (6.2, 12.0, r=2.5), Top-Right (17.2, 6.0, r=2.5), and Bottom-Right (17.2, 18.0, r=2.5) joined by exact circle-boundary rays.",
  meta: {
      "slug": "share",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Share a betslip, referral link, or big win across social channels.",
      "tags": [
          "share",
          "send",
          "social",
          "network",
          "nodes",
          "export",
          "referral"
      ]
  },
  build: () => {
      const cL = [6.2, 12.0], cT = [17.2, 6.0], cB = [17.2, 18.0], R = 2.5;
      const nL = circleD(cL[0], cL[1], R), nT = circleD(cT[0], cT[1], R), nB = circleD(cB[0], cB[1], R);
      const nLS = circleD(cL[0], cL[1], 2.9), nTS = circleD(cT[0], cT[1], 2.9), nBS = circleD(cB[0], cB[1], 2.9);
      const uT = norm(sub(cT, cL)), uB = norm(sub(cB, cL));
      const p1 = add(cL, mul(uT, R)), p2 = sub(cT, mul(uT, R));
      const p3 = add(cL, mul(uB, R)), p4 = sub(cB, mul(uB, R));
      const rays = `M${P(p1)}L${P(p2)}M${P(p3)}L${P(p4)}`;
      return {
        keylines: drawKeylines([[6.2, 12, 2.5], [17.2, 6, 2.5], [17.2, 18, 2.5]], [p1, p2, p3, p4]),
        line: `<path d="${nL}"/><path d="${nT}"/><path d="${nB}"/><path d="${rays}"/>`,
        solid: { fill: [nLS, nTS, nBS], stroke: [rays] },
        duotone: { tone: [nLS, nTS, nBS], secondary: [rays], line: `<path d="${nL}"/><path d="${nT}"/><path d="${nB}"/><path d="${rays}"/>` }
      };
    }
};
