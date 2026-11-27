// Surgical-precision icon module: fdsi-baseball-glove (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "sb-baseball-glove",
  slug: "baseball-glove",
  name: "Baseball Glove / Mitt",
  area: "sb",
  order: 57,
  desc: "Large organic curved leather baseball fielder's mitt (glove only, no ball) with 4 sweeping curved finger stalls, bulbous angled thumb bolster, laced T-webbing basket, and cupped palm pocket.",
  meta: {
      "slug": "baseball-glove",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Cupped leather baseball fielder's mitt with 3 rounded finger stalls, angled thumb bolster, laced webbing basket, and a stitched baseball nestled inside the palm pocket.",
      "tags": [
          "baseball-glove"
      ],
      "status": "todo",
      "reworkNote": "Too organic It is hard to recognize whether its a glove or some irregular shape. Icon would not be easiuly recognized without text label.",
      "comments": [
          {
              "id": "c_1795773110312",
              "author": "designer",
              "text": "Too organic It is hard to recognize whether its a glove or some irregular shape. Icon would not be easiuly recognized without text label.",
              "status": "open",
              "createdAt": "2026-11-27T09:51:50.312Z"
          },
          {
              "id": "c_1795773180576_8yt7",
              "author": "designer",
              "text": "Too organic It is hard to recognize whether its a glove or some irregular shape. Icon would not be easiuly recognized without text label.",
              "status": "open",
              "createdAt": "2026-11-27T09:53:00.576Z"
          }
      ]
  },
  build: () => {
    // Large, organic curved leather baseball mitt filling the 20x20 active zone (2.8..21.0, 2.8..21.0):
    // 4 curved finger tips across the top-right + deep sweeping right outer wall + cupped wrist heel + bulbous angled left thumb:
    const mittOutline =
      `M8.2 10.6` +
      `C7.8 7.8 8.2 5.4 9.0 4.0` +
      `A1.55 1.55 0 0 1 12.0 4.2` +
      `C12.2 3.4 12.6 2.8 13.5 2.8` +
      `A1.55 1.55 0 0 1 15.1 4.2` +
      `C15.5 3.6 16.2 3.2 17.0 3.5` +
      `A1.5 1.5 0 0 1 18.2 5.2` +
      `C19.0 4.9 19.8 5.2 20.3 6.0` +
      `A1.5 1.5 0 0 1 20.6 7.8` +
      `C21.2 11.4 20.6 15.2 18.6 18.0` +
      `C16.8 20.2 14.2 21.0 11.2 21.0` +
      `C7.4 21.0 4.6 19.0 3.5 15.6` +
      `C2.7 13.2 2.8 10.2 3.8 8.0` +
      `A1.8 1.8 0 0 1 7.1 8.8` +
      `C7.0 9.6 7.0 10.2 7.2 10.8` +
      `A0.7 0.7 0 0 0 8.2 10.6Z`;

    // Organic curved finger seams following the natural inward curl of the mitt:
    const fingerSeams =
      `M12.0 4.2C11.7 6.8 11.8 9.2 12.2 11.0` +
      `M15.1 4.2C14.8 6.8 14.9 9.2 15.2 11.2` +
      `M18.2 5.2C17.8 7.6 17.8 9.8 18.0 11.6`;

    // Sweeping thumb bolster crease & cupped palm heel pocket curve (no baseball):
    const thumbSeam = `M7.2 10.8C7.6 13.6 9.0 15.8 11.6 16.8`;
    const palmPocket = `M11.6 14.2C13.6 15.2 15.8 15.0 17.4 13.8`;
    const heelSeam = `M7.4 18.0C10.2 19.2 13.8 19.2 16.4 17.8`;

    // Laced I-web / T-webbing basket bridging thumb tip (6.8, 7.6) to index finger (8.5, 6.2):
    const webTop = `M6.8 7.6L8.5 6.2`;
    const webPost = `M7.6 6.9L7.7 10.7`;
    const webFill = `M6.8 7.6L8.5 6.2L8.2 10.6A0.7 0.7 0 0 1 7.2 10.8Z`;
    const webSolid = capsule(6.8, 7.6, 8.5, 6.2, 0.85);

    const lineM =
      `<path d="${mittOutline}"/>` +
      `<path d="${webTop}"/>` +
      `<path d="${webPost}"/>` +
      `<path d="${fingerSeams}"/>` +
      `<path d="${thumbSeam}"/>` +
      `<path d="${palmPocket}"/>` +
      `<path d="${heelSeam}"/>`;

    return {
      keylines: drawKeylines(
        [[12.0, 12.4, 8.6]],
        [[9.0, 4.0], [13.5, 2.8], [17.0, 3.5], [20.3, 6.0], [3.8, 8.0], [11.6, 16.8]]
      ),
      line: lineM,
      solid: {
        fill: [mittOutline],
        face: [webSolid],
        cut: [fingerSeams, thumbSeam, palmPocket, heelSeam]
      },
      duotone: {
        tone: [mittOutline],
        secondary: [webTop, webPost, fingerSeams, thumbSeam, palmPocket, heelSeam],
        line: lineM
      },
      color: (dark) => {
        const leatherMain = dark ? "#9a3412" : "#fed7aa";
        const leatherWeb = dark ? "#78350f" : "#fdba74";
        const leatherSeam = dark ? "#fb923c" : "#ea580c";
        return (
          `<path d="${webFill}" fill="${leatherWeb}" stroke="none"/>` +
          `<path d="${mittOutline}" fill="${leatherMain}" stroke="none"/>` +
          `<path d="${webTop}" fill="none" stroke="${leatherSeam}"/>` +
          `<path d="${webPost}" fill="none" stroke="${leatherSeam}"/>` +
          `<path d="${fingerSeams}" fill="none" stroke="${leatherSeam}"/>` +
          `<path d="${thumbSeam}" fill="none" stroke="${leatherSeam}"/>` +
          `<path d="${palmPocket}" fill="none" stroke="${leatherSeam}"/>` +
          `<path d="${heelSeam}" fill="none" stroke="${leatherSeam}"/>` +
          `<path d="${mittOutline}"/>`
        );
      }
    };
  }
};
