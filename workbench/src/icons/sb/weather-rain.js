// Surgical-precision icon module: fdsi-weather-rain (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-128-weather-rain",
  slug: "weather-rain",
  name: "#128. Pitch Weather — Rain (3-Circle Tangent Cloud + 3 Diagonal Rain Streaks)",
  area: "sb",
  order: 161,
  desc: "Constructed from 3 tangent cloud circles: Left lobe (7.4, 11.2, r=3.4), Top dome (12.4, 8.6, r=4.6), Right lobe (17.2, 11.6, r=3.0) with flat bottom at y=14.6 + 3 rain streaks below!",
  meta: {
      "slug": "weather-rain",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Match pitch weather conditions, rain delay, and wet-track specials.",
      "tags": [
          "weather",
          "rain",
          "cloud",
          "pitch-conditions",
          "wet",
          "forecast"
      ]
  },
  build: () => {
      const cloud =
        `M7.4 14.6` +
        `A3.4 3.4 0 0 1 6.6 7.9` +
        `A4.6 4.6 0 0 1 16.8 8.6` +
        `A3.0 3.0 0 0 1 17.2 14.6Z`;
      const rain = `M7.6 17.2L6.2 20.2M12.4 17.2L11.0 20.2M17.2 17.2L15.8 20.2`;
      return {
        keylines: drawKeylines([[7.4, 11.2, 3.4], [12.4, 8.6, 4.6], [17.2, 11.6, 3.0]], [[7.4, 14.6], [17.2, 14.6]]),
        line: `<path d="${cloud}"/><path d="${rain}"/>`,
        solid: {
          fill: [cloud],
          stroke: [rain]
        },
        duotone: { tone: [cloud], secondary: [rain], line: `<path d="${cloud}"/><path d="${rain}"/>` }
      };
    }
};
