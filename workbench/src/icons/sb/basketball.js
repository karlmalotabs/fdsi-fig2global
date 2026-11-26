// Surgical-precision icon module: fdsi-basketball (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, P, polar, ellipseY, sectorFace, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "basketball-basket",
  slug: "basketball",
  name: "Basketball Hoop (Exact ellipseY + Polar Seam Lock)",
  area: "sb",
  order: 206,
  desc: "Every net cord originates on the exact mathematical ellipseY(x) of the rim; diagonals anchor to bottom corners (zero bumps or prongs).",
  meta: {
      "slug": "basketball",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "NBA, EuroLeague, and FIBA basketball point spread, total, and player props.",
      "tags": [
          "basketball",
          "nba",
          "hoop",
          "basket",
          "net",
          "euroleague",
          "court"
      ]
  },
  build: ({ s }) => {
      const cx = 12, cy = 8.2, R = 4.6;
      const pBallL = polar(cx, cy, R, 162), pBallR = polar(cx, cy, R, 18);
      const ballArc = `M${P(pBallL)}A${R} ${R} 0 1 1 ${P(pBallR)}`;
      const ballClosed = `${ballArc}Q12 10.6 ${P(pBallL)}Z`;
      const pTop = polar(cx, cy, R, -90), pSeamR = polar(cx, cy, R, 12), pSeamL = polar(cx, cy, R, 168);
      const seams = `M${P(pTop)}L12 8.0M12 8.0L${P(pSeamR)}M12 8.0L${P(pSeamL)}`;
      const f1 = sectorFace(cx, cy, R, -90, 12, s, 0.45);
      const f2 = sectorFace(cx, cy, R, 168, 270, s, 0.45);
      const f3 = sectorFace(cx, cy, R, 12, 168, s, 0.45);

      const rcx = 12, rcy = 11.8, rx = 7.8, ry = 2.2;
      const rimFront = `M4.2 ${rcy}A${rx} ${ry} 0 0 0 19.8 ${rcy}`;
      const yBack = ellipseY(rcx, rcy, rx, ry, 5.8, "top");
      const rimAll = `${rimFront}M4.2 ${rcy}A${rx} ${ry} 0 0 1 5.8 ${f(yBack)}M18.2 ${f(yBack)}A${rx} ${ry} 0 0 1 19.8 ${rcy}`;

      const yNetTop = ellipseY(rcx, rcy, rx, ry, 4.6, "bottom");
      const xBotL = 7.6, xBotR = 16.4, yBot = 20.5;
      const yMid = 16.8, tMid = (yMid - yNetTop) / (yBot - yNetTop);
      const xMidL = 4.6 + (xBotL - 4.6) * tMid, xMidR = 19.4 + (xBotR - 19.4) * tMid;
      const netSides = `M4.6 ${f(yNetTop)}L${xBotL} ${yBot}M19.4 ${f(yNetTop)}L${xBotR} ${yBot}M${f(xMidL)} ${yMid}Q12 18.2 ${f(xMidR)} ${yMid}`;
      const yDiagTop = ellipseY(rcx, rcy, rx, ry, 8.4, "bottom");
      const netMesh = `M8.4 ${f(yDiagTop)}L${xBotR} ${yBot}M15.6 ${f(yDiagTop)}L${xBotL} ${yBot}`;
      const netClosed = `M4.6 ${f(yNetTop)}Q12 ${f(rcy + ry)} 19.4 ${f(yNetTop)}L${xBotR} ${yBot}H${xBotL}Z`;
      return {
        keylines: drawKeylines([[cx, cy, R]], [pBallL, pBallR, pTop, [4.6, yNetTop], [8.4, yDiagTop], [15.6, yDiagTop], [19.4, yNetTop], [xMidL, yMid], [xMidR, yMid]]),
        line: `<path d="${ballArc}"/><path d="${seams}"/><path d="${rimAll}"/><path d="${netSides}"/><path d="${netMesh}"/>`,
        solid: { faces: [f1, f2, f3], knocks: [rimAll, 'M3 13.5H21'], stroke: [rimAll, netSides, netMesh] },
        duotone: { tone: [ballClosed, netClosed], secondary: [seams, netMesh], line: `<path d="${ballArc}"/><path d="${rimAll}"/><path d="${netSides}"/>` }
      };
    }
};
