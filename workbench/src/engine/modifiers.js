import { circleD, capsule, polar, bloatPoly, bloatRect } from "./primitives.js";

export const BADGE_DISC = circleD(18.5, 18.5, 4.5);

export const MODS = {
  none: null,
  check: {
    kind: "badge",
    color: "#1a7f37",
    hole: () => capsule([16.6, 18.6], [18.0, 20.0], 1.45) + capsule([18.0, 20.0], [20.6, 17.1], 1.45),
  },
  plus: {
    kind: "badge",
    color: "#1a7f37",
    hole: () => capsule([18.5, 16.3], [18.5, 20.7], 1.45) + capsule([16.3, 18.5], [20.7, 18.5], 1.45),
  },
  minus: {
    kind: "badge",
    color: "#cf222e",
    hole: () => capsule([16.3, 18.5], [20.7, 18.5], 1.5),
  },
  blocked: {
    kind: "badge",
    color: "#cf222e",
    hole: () => capsule([16.7, 16.7], [20.3, 20.3], 1.55),
  },
  info: {
    kind: "badge",
    color: "#0969da",
    hole: () => capsule([18.5, 18.2], [18.5, 20.8], 1.45) + circleD(18.5, 16.2, 0.85),
  },
  pending: {
    kind: "badge",
    color: "#0969da",
    hole: () => capsule([18.5, 16.2], [18.5, 18.5], 1.4) + capsule([18.5, 18.5], [20.2, 19.6], 1.4),
  },
  star: {
    kind: "outside",
    color: "#d97706",
    shape: () => {
      const pts = Array.from({ length: 10 }, (_, i) => polar(18.5, 18.5, i % 2 === 0 ? 4.7 : 2.15, -90 + i * 36));
      return bloatPoly(pts, [0.45, 0.25, 0.45, 0.25, 0.45, 0.25, 0.45, 0.25, 0.45, 0.25], 0, { minEdge: 99 }).d;
    },
  },
  sparkle: {
    kind: "outside",
    color: "#d97706",
    shape: () => `M18.5 13.6Q19.15 17.85 23.4 18.5Q19.15 19.15 18.5 23.4Q17.85 19.15 13.6 18.5Q17.85 17.85 18.5 13.6Z`,
  },
  padlock: {
    kind: "outside",
    color: "#0969da",
    body: () => bloatRect({ x: 14.8, y: 17.2, w: 7.4, h: 5.4, r: 1.4, b: 0.15 }).d,
    shackle: `M16.5 17.2V15.6A2.0 2.0 0 0 1 20.5 15.6V17.2`,
    keyhole: () => circleD(18.5, 19.9, 0.85),
  },
  flame: {
    kind: "outside",
    color: "#f97316",
    shape: () =>
      `M15.1 19.2` +
      `A3.4 3.4 0 0 0 21.9 19.2` +
      `A6.0 6.0 0 0 0 19.0 13.3` +
      `A3.4 3.4 0 0 0 17.5 17.0` +
      `A2.4 2.4 0 0 1 16.3 15.4` +
      `A5.0 5.0 0 0 0 15.1 19.2Z`,
    hole: () => `M17.1 19.7A1.4 1.4 0 0 0 19.9 19.7A2.6 2.6 0 0 0 18.5 17.2A2.6 2.6 0 0 0 17.1 19.7Z`,
  },
};
