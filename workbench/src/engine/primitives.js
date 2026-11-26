/* ============================================================================
   SURGICAL-PRECISION GEOMETRIC SOLVER KERNEL (ZERO GUESSTIMATION, ZERO BITMAPS)
   ============================================================================ */
let _uid = 0;
export const nextUid = () => ++_uid;

export const f = (n) => +(+n).toFixed(2);
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const mul = (a, k) => [a[0] * k, a[1] * k];
export const len = (a) => Math.hypot(a[0], a[1]);
export const norm = (a) => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l];
};
export const P = (p) => `${f(p[0])} ${f(p[1])}`;
export const deg2rad = (d) => (d * Math.PI) / 180;
export const rad2deg = (r) => (r * 180) / Math.PI;

export function polar(cx, cy, r, deg) {
  const a = deg2rad(deg);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export const circleD = (cx, cy, r) =>
  `M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;

export function arcD(cx, cy, r, deg0, deg1, sweep = 1) {
  const p0 = polar(cx, cy, r, deg0),
    p1 = polar(cx, cy, r, deg1);
  let span = sweep ? deg1 - deg0 : deg0 - deg1;
  while (span < 0) span += 360;
  while (span >= 360) span -= 360;
  const large = span > 180 ? 1 : 0;
  return `M${P(p0)}A${f(r)} ${f(r)} 0 ${large} ${sweep} ${P(p1)}`;
}

// EXACT EXTERNAL BITANGENTS BETWEEN TWO CIRCLES (x1, y1, r1) AND (x2, y2, r2):
export function outerTangents(c1, r1, c2, r2) {
  const dx = c2[0] - c1[0],
    dy = c2[1] - c1[1];
  const d = Math.hypot(dx, dy);
  const base = Math.atan2(dy, dx);
  const alpha = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / d)));
  const aL = base - alpha,
    aR = base + alpha;
  return {
    left: {
      p1: [c1[0] + r1 * Math.cos(aL), c1[1] + r1 * Math.sin(aL)],
      p2: [c2[0] + r2 * Math.cos(aL), c2[1] + r2 * Math.sin(aL)],
      ang: rad2deg(aL),
    },
    right: {
      p1: [c1[0] + r1 * Math.cos(aR), c1[1] + r1 * Math.sin(aR)],
      p2: [c2[0] + r2 * Math.cos(aR), c2[1] + r2 * Math.sin(aR)],
      ang: rad2deg(aR),
    },
  };
}

// CONVEX TANGENT HULL OF TWO CIRCLES (CAPSULE / TAPERED DROP / MUSCLE LIMB / SNOUT):
export function tangentHull2(c1, r1, c2, r2) {
  const T = outerTangents(c1, r1, c2, r2);
  let span2 = T.right.ang - T.left.ang;
  while (span2 < 0) span2 += 360;
  const span1 = 360 - span2;
  return {
    d:
      `M${P(T.left.p1)}L${P(T.left.p2)}` +
      `A${f(r2)} ${f(r2)} 0 ${span2 > 180 ? 1 : 0} 1 ${P(T.right.p2)}` +
      `L${P(T.right.p1)}` +
      `A${f(r1)} ${f(r1)} 0 ${span1 > 180 ? 1 : 0} 1 ${P(T.left.p1)}Z`,
    pts: [T.left.p1, T.left.p2, T.right.p2, T.right.p1],
  };
}

export function capsule(a, b, w, x2, r) {
  if (typeof a === "number") return tangentHull2([a, b], r, [w, x2], r).d;
  return tangentHull2(a, w / 2, b, w / 2).d;
}

export const arcPath = (cx, cy, r, deg0, deg1) => arcD(cx, cy, r, deg0, deg1, 1);
export const ellipseD = (cx, cy, rx, ry) =>
  `M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`;

export function ellipseY(cx, cy, rx, ry, x, half = "bottom") {
  const t = Math.max(0, 1 - ((x - cx) / rx) ** 2),
    dy = ry * Math.sqrt(t);
  return half === "bottom" ? cy + dy : cy - dy;
}

export function roundOpen(pts, r) {
  if (pts.length < 2) return "";
  let d = `M${P(pts[0])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const v = pts[i],
      p = pts[i - 1],
      q = pts[i + 1];
    const k = Math.min(r, len(sub(p, v)) * 0.45, len(sub(q, v)) * 0.45);
    const a = add(v, mul(norm(sub(p, v)), k));
    const b = add(v, mul(norm(sub(q, v)), k));
    d += `L${P(a)}Q${P(v)} ${P(b)}`;
  }
  return d + `L${P(pts[pts.length - 1])}`;
}

export function sampleCubic(c, n = 20) {
  const o = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n,
      m = 1 - t;
    o.push([
      m * m * m * c[0][0] + 3 * m * m * t * c[1][0] + 3 * m * t * t * c[2][0] + t * t * t * c[3][0],
      m * m * m * c[0][1] + 3 * m * m * t * c[1][1] + 3 * m * t * t * c[2][1] + t * t * t * c[3][1],
    ]);
  }
  return o;
}

export function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i],
      q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

export function outwardNormal(p, q, cw) {
  const u = norm(sub(q, p));
  return cw ? [u[1], -u[0]] : [-u[1], u[0]];
}

export function insetPoly(pts, b) {
  if (Math.abs(b) < 1e-4) return pts.map((p) => [...p]);
  const n = pts.length,
    cw = signedArea(pts) > 0;
  const lines = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      q = pts[(i + 1) % n],
      u = norm(sub(q, p));
    const nn = outwardNormal(p, q, cw);
    lines.push([sub(p, mul(nn, b)), u]);
  }
  return pts.map((_, i) => {
    const [a, u] = lines[(i - 1 + n) % n],
      [c, v] = lines[i];
    const den = u[0] * v[1] - u[1] * v[0];
    if (Math.abs(den) < 1e-6) return c;
    const t = ((c[0] - a[0]) * v[1] - (c[1] - a[1]) * v[0]) / den;
    return add(a, mul(u, t));
  });
}

export function bloatPoly(rawPts, r, b, opts = {}) {
  const inset = opts.inset ?? 0.75;
  const minEdge = opts.minEdge ?? 4.5;
  const edgeBulge = opts.edgeBulge;
  const pts = insetPoly(rawPts, b * inset);
  const n = pts.length,
    cw = signedArea(pts) > 0;
  const rad = (i) => (Array.isArray(r) ? r[i] : r);

  const E = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      q = pts[(i + 1) % n],
      d = sub(q, p),
      L = len(d),
      u = norm(d);
    const nn = outwardNormal(p, q, cw);
    const r0 = Math.min(rad(i), L * 0.45);
    const r1 = Math.min(rad((i + 1) % n), L * 0.45);
    const a = add(p, mul(u, r0)),
      c = sub(q, mul(u, r1));
    const el = len(sub(c, a));
    const eScale = edgeBulge ? edgeBulge[i] : 1;
    const bb = (el < minEdge ? 0 : b) * eScale;
    const c1 = add(add(a, mul(u, el / 3)), mul(nn, (4 * bb) / 3));
    const c2 = add(sub(c, mul(u, el / 3)), mul(nn, (4 * bb) / 3));
    E.push([a, c1, c2, c]);
  }

  let d = `M${P(E[0][0])}`;
  const anchors = new Array(n);
  const poly = [];

  for (let i = 0; i < n; i++) {
    const e = E[i],
      nx = E[(i + 1) % n];
    d += `C${P(e[1])} ${P(e[2])} ${P(e[3])}`;
    poly.push(...sampleCubic(e, 20));

    const A = e[3],
      Z = nx[0];
    const d1 = norm(sub(e[3], e[2])),
      d2 = norm(sub(nx[1], nx[0]));
    const ch = len(sub(Z, A));
    const phi = Math.acos(Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1])));
    let cc;
    if (phi < 1e-3 || ch < 1e-3) {
      cc = [A, A, Z, Z];
      if (ch > 1e-3) d += `L${P(Z)}`;
    } else {
      const R = ch / (2 * Math.sin(phi / 2));
      const k = (4 / 3) * Math.tan(phi / 4) * R;
      cc = [A, add(A, mul(d1, k)), sub(Z, mul(d2, k)), Z];
      d += `C${P(cc[1])} ${P(cc[2])} ${P(cc[3])}`;
    }
    const cPts = sampleCubic(cc, 12);
    poly.push(...cPts);
    anchors[(i + 1) % n] = cPts[6];
  }

  const xs = poly.map((p) => p[0]),
    ys = poly.map((p) => p[1]);
  const box = {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  };
  return { d: d + "Z", anchors, poly, pts, box };
}

export function bloatRect({ x, y, w, h, r, b }) {
  return bloatPoly(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    r,
    b,
    { minEdge: 4.5 }
  );
}

export function edgeX(poly, yy, side) {
  let best = side === "right" ? -Infinity : Infinity;
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i],
      c = poly[i + 1];
    if ((a[1] - yy) * (c[1] - yy) <= 0 && a[1] !== c[1]) {
      const x = a[0] + ((c[0] - a[0]) * (yy - a[1])) / (c[1] - a[1]);
      best = side === "right" ? Math.max(best, x) : Math.min(best, x);
    }
  }
  return best;
}

export function edgeY(poly, xx, side) {
  let best = side === "bottom" ? -Infinity : Infinity;
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i],
      c = poly[i + 1];
    if ((a[0] - xx) * (c[0] - xx) <= 0 && a[0] !== c[0]) {
      const y = a[1] + ((c[1] - a[1]) * (xx - a[0])) / (c[0] - a[0]);
      best = side === "bottom" ? Math.max(best, y) : Math.min(best, y);
    }
  }
  return best;
}

export function spanLine(shape, yy, b) {
  const { y, h } = shape.box;
  const x0 = edgeX(shape.poly, yy, "left"),
    x1 = edgeX(shape.poly, yy, "right");
  const top = yy < y + h / 2,
    dist = top ? yy - y : y + h - yy;
  const sag = Math.max(0, 1 - dist / (h / 2)) * b * (top ? -1 : 1);
  const L = x1 - x0;
  return `M${f(x0)} ${f(yy)}C${f(x0 + L / 3)} ${f(yy + (4 * sag) / 3)} ${f(x1 - L / 3)} ${f(yy + (4 * sag) / 3)} ${f(x1)} ${f(yy)}`;
}

export function facePoly(pts, { offset, r, bulge }) {
  const n = pts.length;
  const off = (i) => (Array.isArray(offset) ? offset[i] : offset);
  const rad = (i) => (Array.isArray(r) ? r[i] : r);
  const bul = (i) => (Array.isArray(bulge) ? bulge[i] : bulge || 0);
  const Ls = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      q = pts[(i + 1) % n],
      u = norm(sub(q, p)),
      nn = [u[1], -u[0]];
    Ls.push([sub(p, mul(nn, off(i))), u]);
  }
  const Q = pts.map((_, i) => {
    const [a, u] = Ls[(i - 1 + n) % n],
      [c, v] = Ls[i],
      den = u[0] * v[1] - u[1] * v[0];
    if (Math.abs(den) < 1e-9) return c;
    const tt = ((c[0] - a[0]) * v[1] - (c[1] - a[1]) * v[0]) / den;
    return add(a, mul(u, tt));
  });
  const E = [];
  for (let i = 0; i < n; i++) {
    const p = Q[i],
      q = Q[(i + 1) % n],
      Ln = len(sub(q, p)),
      u = norm(sub(q, p)),
      nn = [u[1], -u[0]];
    const d0 = Math.min(rad(i), Ln / 2 - 0.01),
      d1 = Math.min(rad((i + 1) % n), Ln / 2 - 0.01);
    const a = add(p, mul(u, d0)),
      c = sub(q, mul(u, d1)),
      EL = len(sub(c, a)),
      bb = EL < 3.5 ? 0 : bul(i);
    E.push([a, add(add(a, mul(u, EL / 3)), mul(nn, (4 * bb) / 3)), add(sub(c, mul(u, EL / 3)), mul(nn, (4 * bb) / 3)), c]);
  }
  let d = `M${P(E[0][0])}`;
  for (let i = 0; i < n; i++) {
    const e = E[i],
      nx = E[(i + 1) % n];
    d += `C${P(e[1])} ${P(e[2])} ${P(e[3])}`;
    const A = e[3],
      Z = nx[0],
      d1 = norm(sub(e[3], e[2])),
      d2 = norm(sub(nx[1], nx[0]));
    const phi = Math.acos(Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1]))),
      ch = len(sub(Z, A));
    if (phi < 1e-3 || ch < 1e-3) {
      d += `L${P(Z)}`;
      continue;
    }
    const R = ch / (2 * Math.sin(phi / 2)),
      k = (4 / 3) * Math.tan(phi / 4) * R;
    d += `C${P(add(A, mul(d1, k)))} ${P(sub(Z, mul(d2, k)))} ${P(Z)}`;
  }
  return d + "Z";
}

export function sectorFace(cx, cy, R, a0, a1, s, rCorner = 0.55) {
  const h = s / 2,
    rOut = R + h;
  const u0 = [Math.cos(deg2rad(a0)), Math.sin(deg2rad(a0))],
    n0 = [-u0[1], u0[0]];
  const u1 = [Math.cos(deg2rad(a1)), Math.sin(deg2rad(a1))],
    n1 = [u1[1], -u1[0]];
  const dAng = deg2rad((a1 - a0) / 2),
    mid = deg2rad((a0 + a1) / 2);
  const rApex = h / Math.sin(dAng);
  const apex = [cx + rApex * Math.cos(mid), cy + rApex * Math.sin(mid)];
  const LProj = Math.sqrt(Math.max(0, rOut * rOut - h * h));
  const c0 = add([cx, cy], add(mul(u0, LProj), mul(n0, h)));
  const c1 = add([cx, cy], add(mul(u1, LProj), mul(n1, h)));
  const pA0 = add(apex, mul(u0, rCorner * 1.1)),
    pA1 = add(apex, mul(u1, rCorner * 1.1));
  const pC0 = sub(c0, mul(u0, rCorner)),
    pC1 = sub(c1, mul(u1, rCorner));
  const ang0 = Math.atan2(c0[1] - cy, c0[0] - cx) + rCorner / rOut;
  const ang1 = Math.atan2(c1[1] - cy, c1[0] - cx) - rCorner / rOut;
  const arc0 = [cx + rOut * Math.cos(ang0), cy + rOut * Math.sin(ang0)];
  const arc1 = [cx + rOut * Math.cos(ang1), cy + rOut * Math.sin(ang1)];
  const large = ang1 - ang0 > Math.PI ? 1 : 0;
  return `M${P(pA0)}L${P(pC0)}Q${P(c0)} ${P(arc0)}A${f(rOut)} ${f(rOut)} 0 ${large} 1 ${P(arc1)}Q${P(c1)} ${P(pC1)}L${P(pA1)}Q${P(apex)} ${P(pA0)}Z`;
}

export function drawKeylines(circles = [], tangents = []) {
  return (
    `<g class="kl-overlay" pointer-events="none">` +
    circles
      .map(
        ([x, y, r]) =>
          `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="var(--keyline, #e11d48)" stroke-width="0.28" stroke-dasharray="0.6 0.45"/>`
      )
      .join("") +
    tangents
      .map(
        ([x, y]) =>
          `<circle cx="${f(x)}" cy="${f(y)}" r="0.48" fill="var(--tangent, #0284c7)" stroke="var(--bg-card, #ffffff)" stroke-width="0.18"/>`
      )
      .join("") +
    `</g>`
  );
}
