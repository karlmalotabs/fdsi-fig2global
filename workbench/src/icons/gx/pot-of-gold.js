// Surgical-precision icon module: fdsi-pot-of-gold (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-d-66-pot-of-gold",
  slug: "pot-of-gold",
  name: "#66. Pot of Gold / Irish Jackpot (2 Large Bold Gold Coins + Cauldron)",
  area: "gx",
  order: 99,
  desc: "FIXED COLOR: The 2 coins are filled bright Gold (`#fbbf24`) and masked cleanly behind the cauldron rim (`#10b981`), while the cauldron belly is rich Emerald/Slate!",
  meta: {
      "slug": "pot-of-gold",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Rainbow jackpot pots, Irish gold collect features, and progressive treasure.",
      "tags": [
          "pot-of-gold",
          "cauldron",
          "irish",
          "rainbow",
          "coins",
          "jackpot",
          "treasure"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.1);
      const rim = bloatRect({ x: 3.8, y: 9.8, w: 16.4, h: 3.0, r: cr, b: b * 0.3 });
      const belly = `M5.0 12.8C3.8 16.8 6.4 20.4 12.0 20.4C17.6 20.4 20.2 16.8 19.0 12.8`;
      const bellyFill = `M5.0 12.6H19.0C20.2 16.8 17.6 20.4 12.0 20.4C6.4 20.4 3.8 16.8 5.0 12.6Z`;
      const coinL = circleD(9.2, 7.0, 3.2);
      const coinR = circleD(15.0, 7.4, 3.0);
      const potMaskBlock = `M0 9.8H24V24H0Z`;
      const uidPg = "pg6_" + (nextUid());
      const lineM =
        `<defs>` +
        `<mask id="${uidPg}L" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${potMaskBlock}" fill="#000"/></mask>` +
        `<mask id="${uidPg}R" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${potMaskBlock}" fill="#000"/><path d="${coinL}" fill="#000" stroke="#000" stroke-width="1.5"/></mask>` +
        `</defs>` +
        `<path d="${coinR}" mask="url(#${uidPg}R)"/>` +
        `<path d="${coinL}" mask="url(#${uidPg}L)"/>` +
        `<path d="${belly}"/><path d="${rim.d}"/>`;

      const bellySolid = `M4.8 14.4A0.9 0.9 0 0 1 5.7 13.6H18.3A0.9 0.9 0 0 1 19.2 14.4C20.0 17.8 17.4 20.6 12.0 20.6C6.6 20.6 4.0 17.8 4.8 14.4Z`;
      const coinLSolid = `M5.9 8.4A3.4 3.4 0 1 1 12.5 8.4Z`;
      const coinRSolid = `M13.6 8.4A2.9 2.9 0 0 1 18.2 8.4Z`;
      // Clipped coin fills for Duotone & Color so the coins never bleed into the pot:
      const coinLClip = `M6.0 9.8A3.2 3.2 0 1 1 12.4 9.8Z`;
      const coinRClip = `M12.2 9.8A3.0 3.0 0 1 1 18.0 9.8Z`;

      return {
        keylines: drawKeylines([[9.2, 7.0, 3.2], [15.0, 7.4, 3.0]], [...rim.anchors, [12, 20.4]]),
        line: lineM,
        solid: {
          face: [coinLSolid, coinRSolid, rim.d, bellySolid]
        },
        duotone: { tone: [coinLClip, coinRClip, bellyFill], secondary: [rim.d], line: lineM },
        color: (dark) => `<path d="${coinRClip}" fill="${dark ? '#b45309' : '#f59e0b'}" stroke="none"/><path d="${coinLClip}" fill="${dark ? '#d97706' : '#fbbf24'}" stroke="none"/><path d="${bellyFill}" fill="${dark ? '#064e3b' : '#a7f3d0'}" stroke="none"/><path d="${rim.d}" fill="${dark ? '#047857' : '#34d399'}" stroke="none"/>${lineM}`
      };
    }
};
