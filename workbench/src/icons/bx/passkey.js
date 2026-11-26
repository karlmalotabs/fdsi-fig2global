// Surgical-precision icon module: fdsi-passkey (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "passkey",
  slug: "passkey",
  name: "Security Passkey (Same Silhouette in Line & Solid!)",
  area: "bx",
  order: 219,
  desc: "FIXED SOLID: Solid fills the circular bow (with keyring hole) and keeps the exact same crisp stepped shaft & teeth stroke as Line mode!",
  meta: {
      "slug": "passkey",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Passwordless WebAuthn passkey login and cryptographic sign-in.",
      "tags": [
          "passkey",
          "key",
          "auth",
          "passwordless",
          "biometric",
          "security",
          "login"
      ]
  },
  build: () => {
      const cx = 7.5, cy = 12.0, R = 4.5;
      const bow = circleD(cx, cy, R);
      const hole = circleD(7.0, 12.0, 1.5);
      const shaft = `M12.0 12.0H21.0V15.8M17.2 12.0V15.2`;
      return {
        keylines: drawKeylines([[cx, cy, R], [7.0, 12.0, 1.5]], [[12.0, 12.0], [17.2, 12.0], [21.0, 12.0]]),
        line: `<path d="${bow}"/><path d="${hole}"/><path d="${shaft}"/>`,
        solid: {
          fill: [bow],
          holeExact: [circleD(7.0, 12.0, 1.9)],
          stroke: [shaft]
        },
        duotone: {
          tone: [bow],
          secondary: [shaft],
          line: `<path d="${bow}"/><path d="${hole}"/><path d="${shaft}"/>`
        }
      };
    }
};
