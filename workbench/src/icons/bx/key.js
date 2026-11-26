// Surgical-precision icon module: fdsi-key (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-key",
  slug: "key",
  name: "Passkey / Access Key (Circular Bow + Stepped Bit)",
  area: "bx",
  order: 17,
  desc: "r=4.5 circular key bow at (7.5, 12) with r=1.5 keyring hole at (7.0, 12) + horizontal shaft & 2 bit teeth.",
  meta: {
      "slug": "key",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Password recovery, security credentials, or API/account access key.",
      "tags": [
          "key",
          "password",
          "access",
          "unlock",
          "credentials",
          "security",
          "auth"
      ],
      "status": "todo"
  },
  build: () => {
      const cx = 7.5, cy = 12.0, R = 4.5;
      const bow = circleD(cx, cy, R);
      const hole = circleD(7.0, 12.0, 1.5);
      const shaft = `M12.0 12.0H21.0V15.8M17.2 12.0V15.2`;
      return {
        keylines: drawKeylines([[cx, cy, R], [7.0, 12.0, 1.5]], [[12.0, 12.0], [17.2, 12.0], [21.0, 12.0]]),
        line: `<path d="${bow}"/><path d="${hole}"/><path d="${shaft}"/>`,
        solid: { fill: [bow], holeExact: [circleD(7.0, 12.0, 1.9)], stroke: [shaft] },
        duotone: { tone: [bow], secondary: [shaft], line: `<path d="${bow}"/><path d="${hole}"/><path d="${shaft}"/>` }
      };
    }
};
