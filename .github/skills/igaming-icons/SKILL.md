---
name: igaming-icons
description: Author and compile 24x24 iGaming & Sportsbook icons (Line + Constructed Solid active state) on the subject + modifier system, with tenant tokens for stroke, roundness, and bloat.
---

# iGaming icon authoring

Read `docs/SPEC.md` first for locked canvas/zone rules. This document defines the **2D Spatial Construction Protocol**, **Anchor-Locked Bloat (`b`)**, **Constructed Solids (`solidFaces` / `facePoly` / `capsule` / `outline`)**, **Two-Class Modifiers**, and **Category Recipes** (3D Isometric Balls, Stylized Athlete Pictograms, Organic Animals, Vehicles, and Seasonal/League Totems).

---

## 1. The 2D Spatial Protocol (Decompose Before Writing Coordinates)

Never pixel-trace a reference PNG or run an optimizer loop to fit curves. Always follow these 4 steps:

1. **Read the Global Style & Size Class First:**
   - **Canvas:** `24×24`, active subject zone `2..22` (`20×20`), outer `2px` margin (`0..2`, `22..24`) reserved for modifiers.
   - **Optical Size Class:**
     - `size: 'object'` (`20×20` zone, default) for bodies, equipment, containers, balls, vehicles, animals.
     - `size: 'glyph'` (`14×14` zone, scaled `0.7×` by engine) for standalone directional/action marks (arrows, chevrons, menu, close).
     - `size: 'micro'` (`10×10` zone, or `variants: ['sm']`) for inline carets.
   - **Canonical Token Naming & 5-Category Taxonomy:**
     - **Token format:** `fdsi-{name}-reg-{style}` (where `size` is currently always `reg`, and `style` is `line | solid | duotone | color`, e.g., `fdsi-close-reg-line`, `fdsi-wallet-reg-solid`, `fdsi-roulette-wheel-reg-color`). Never insert `-icon-` after `fdsi-`.
     - **5 Taxonomy Categories:** `core` (navigation, chevrons, carets, close, actions, media, auth, device UI), `gaming` (sportsbook, athletes, ball/team/combat/motor sports, betslip, live match markets), `casino` (slots, table games, live dealer, crash, arcade, jackpot, card suits), `payments` (wallet, deposit, withdraw, cards, bank transfer, QR, cash out, payouts), and `brand` (responsible gaming, KYC, security, VIP, rewards, promotions, support).
   - **Terminal Style:**
     - **Rounded (Default):** `stroke-linecap="round"`, `stroke-linejoin="round"`, corner radius token `t.r` (`1.5` flat, `3.0` soft, `4.5` plump) and edge bloat `t.b` (`0` flat, `0.15` soft, `0.35` plump).
     - **Angular (`cap: 'butt', join: 'miter'` on subject):** Sharp mitred corners (`r = 0`), flat butt caps, and pure circular arcs (`A`) on curved parts.
2. **Identify Hidden 2D Geometry Before Writing Numbers:**
   - **Symmetry & Polar Axes (`polar(cx, cy, r, deg)`):** Place seams on spheres at `15°`, `30°`, `45°`, or `72°` steps. For example, a `basketball` is a symmetric 4-seam globe tilted `-30°` (`60°` axis).
   - **Pythagorean `3-4-5` Slopes (`≈36.87°`):** When a diagonal is shallower than `45°`, use the `3:4:5` right triangle (e.g., `sneaker` vamp drops `6` over `8` from `(9.5, 5.5)` to `(17.5, 11.5)`, so perpendicular lace ticks step along the `(-0.6, +0.8)` normal).
   - **Shared Walls:** Interior boxes (`spray-bottle` label, `wallet` clasp) anchor flush against the outer wall rather than floating with tiny sliver gaps.
3. **Snap to the Rule Grid:**
   - Snap straight-line and center coordinates to `0.5` increments (preferring whole integers).
   - Pick arc radii from `{1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 9, 10, 12}`.
   - Maintain `≥ 1.5px` clear space between parallel strokes and `≥ 2px` inside enclosed counters.

---

## 2. Anchor-Locked Edge Bloat (`t.b`) & Joint Continuity

When a closed shape bloats outward by `t.b`, naive static coordinates detach or kink at joints. Always lock internal seams and attachments using the helpers in `engine/core.js`:

1. **Corner Midpoint Anchors (`H.anchors[i]`):**
   - `bloatPoly(pts, r, b, opts)` returns `{ d, anchors, poly, pts, box }`, where `anchors[i]` is the **exact midpoint on the rendered corner arc `i`** after vertex inset and corner rounding.
   - Any seam meeting a polygon vertex (`cube` / `dice` Y-seams, `squash` throat, `hockey` shaft-to-blade joint, `diamond` girdle and crown facets) **must connect to `H.anchors[i]`**, never to raw `pts[i]`.
2. **Dense Polyline Wall Queries (`edgeX`, `edgeY`, `spanLine`):**
   - Both `bloatRect` and `bloatPoly` return `.poly` (a dense polyline sampling all cubic edges and corners) and `.box`.
   - Use **`edgeX(B.poly, y, 'left' | 'right')`** to lock horizontal attachments (`wallet` clasp, `spray-bottle` right-flush label, `jackpot-777` pull lever, `boxing-glove` thumb fold, `trophy` handles) directly onto a bloated vertical wall.
   - Use **`edgeY(B.poly, x, 'top' | 'bottom')`** to lock vertical attachments (`padlock` shackle legs, `spray-bottle` cap neck, `ping-pong` handle, `calendar` pins, `home` door arch, `slot-reel-cylinder` vertical dividers) onto a bloated top or bottom wall.
   - Use **`spanLine(B, y, t.b)`** for full-width horizontal dividers (`calendar` header, `credit-card` stripe, `ping-pong` rubber collar, `crown` headband, `gift` ribbon) so both endpoints lock to the walls and the line curves sympathetically with the nearest bloated edge.
3. **Per-Vertex Radii (`r: [r0, r1, ...]`) & `edgeBulge` Weights:**
   - `bloatPoly(pts, r, b, { inset, minEdge, edgeBulge })` accepts an array of radii `r` (one per vertex) and an array of `edgeBulge` multipliers (one per edge).
   - For shapes that transition from a wide dome into straight walls (`spray-bottle`, `boxing-glove`, `bell`, `squash` hoop), use a single closed `bloatPoly` with larger shoulder radii (`r ≈ 2.8..3.2`) and smaller base radii (`r ≈ 1.5..2.0`) instead of pasting a separate semicircle onto straight lines (which creates a tangent kink at the shoulder).
   - On crowns or jagged shapes (`crown`, `receipt`, `bookmark`), pass `edgeBulge: [0, 0, ..., 1, 1]` so V-spikes/teeth stay crisp (`0`) while outer side walls and bases bloat (`1`).

---

## 3. Constructed Solids (`solid(t)`) — Pure Analytical Vector Rules (Zero Raster Tracing!)

**CRITICAL BAN ON BITMAP TRACERS (`solidFaces` and `outline`):**
Never call `solidFaces(layers, t)` or `outline(fills, tubes)` from `engine/construct.js`! Both functions rasterize your smooth curves onto a `288×288` pixel bitmap and trace the staircase back with Marching Squares (`conContour`), which produces jagged, polygonal edges and hundreds of extra points when zoomed in.

Instead, build every `solid(t)` using **100% pure analytical SVG curves** (`fill`, `face`/`faces`, `tubes`, `holeExact`, `hole`, `cut`, `knocks`, `stroke`):

```js
// solid(t) return contract (compiled by engine/compiler.js without Marching Squares!):
solid(t) {
  return {
    fill:      [ ... ], // closed centreline paths (filled + stroked by t.s -> exact outer silhouette of line mode)
    face:      [ ... ], // closed paths already at ink boundary (fill-rule="evenodd", stroke="none": facePoly, sectorFace, tangentHull2, bloatRect, bloatPoly)
    over:      [ ... ], // foreground solid shapes rendered ABOVE the holeExact/cut/knocks mask (e.g. Lego top stud, 8-Ball loops, Wallet clasp, Copy front card, Bowling ball)
    tubes:     [ [d, width], ... ], // open round-capped curves rendered as native vector strokes (athlete limbs, spines)
    holeExact: [ ... ], // exact negative-space cutouts (capsule(a,b,w) holes, circleD holes, contour halos)
    hole:      [ ... ], // negative-space cutouts expanded by t.s
    cut:       [ ... ], // negative-space stroke cuts (width = t.s, round caps/joins)
    knocks:    [ ... ], // foreground objects/strokes that carve a 1x-stroke halo (2.2 * t.s) out of fill/face
    stroke:    [ ... ]  // structural poles, shafts, shackles, or wheels that remain strokes in solid mode
  };
}
```

### Decision Matrix: Multi-Shape Padded Solids vs. Continuous Cut/Hole Solids
Choose the right Solid pattern based on the icon's geometry (**Default to Multi-Shape Padded Solids `face: [...]` whenever an object can be decomposed into separate sub-parts!**):

| Icon Family | Solid Pattern to Use | Why |
|---|---|---|
| **1. Faceted Polyhedra, Split Containers & Segmented Objects** (`cube`, `dice`, `diamond-gem`, `royal-crown`, `ui-filter-funnel`, `bet-slip-ticket`, `bet-placed-check`, `payment-card`, `trash-delete`, `calendar-schedule`, `curling-stone`, `bet-free-bet-gift`) | **Multi-Shape Padded Solids (`facePoly` / Separate Bloated Shapes in `face: [...]`, ZERO knockout lines!)** | **Gold-standard rule:** Never punch a thin horizontal or vertical slot line across a container when it can be built from **2–6 independent, self-contained rounded shapes (`bloatRect` / `bloatPoly` / `facePoly`) separated by a `1.5–1.8px` padding gap**! Every sub-part gets its own rounded corners (`r = 0.8..1.5`) so there are zero harsh outer-wall notches. |
| **2. Segmented Equipment & Multi-Part Gear** (`mma-glove`, `american-football`, `badminton-shuttle`, `martial-arts-belt`, `weightlifting-barbell`, `bank-building`, `bet-odds-boost`) | **100% Independent Rounded Sub-Shapes in `face: [...]`** | E.g. `mma-glove` is built from **7 separate rounded shapes** (4 finger sleeves `f1..f4` + separate Left Thumb Pad + Main Dorsal Strike Pad + Lower Wrist Cuff) with `1.5px` padding gaps and **zero** `holeExact`/`cut` lines. `american-football` is built from **3 separate true-arc shapes** (`tipBL`, `centerBarrel`, `tipTR`). `bet-odds-boost` uses a closed arrow polygon + 2 separate `capsule` trail bars. |
| **3. Overlapping Foreground Objects Over a Base Shape** (`bet-builder-lego` stud on cube, `wallet-balance` clasp, `copy-duplicate` front card, `pool-eight-ball` figure-8, `bowling-strike` ball over pin) | **Base in `face`/`fill` + Padded Halo in `holeExact` + Foreground Shape in `over: [...]`** | Never put the foreground shape inside `fill`/`face` if its halo is in `holeExact` (because `<g mask="url(#...c)">` masks all `fill`/`face` shapes and will erase the foreground shape too!). Punch the contour-hugging halo (`holeExact: [halo]`) out of the background `face`/`fill`, and place the foreground shape in **`over: [...]`** so it renders unmasked on top. |
| **4. Multi-Panel Spheres & Wheels** (`waterpolo-ball`, `volleyball-ball`, `roulette-wheel`, `basketball-basket`) | **Analytical Sector Panels (`sectorFace(cx, cy, R, a0, a1, t.s, 0.55)` in `faces: [...]`)** | Uses parallel ray offsets (`h = s/2`), one exact SVG circular arc (`A`), and quadratic corner fillets (`Q`). Gives 6-command vector wedges with uniform padding and zero rim gouges. |
| **5. Rackets, Wheels, Flames & Framed Nets** (`squash-racket`, `tennis-racket`, `roulette-wheel`, `casino-chip`, `hot-flame`) | **Outer `fill: [hoop]` + Concentric Inner Window `holeExact: [innerWindow]` + Interior `stroke: [strings/spokes]`** | Why `squash-racket` succeeded: instead of slicing the outer hoop into tiny slivers or leaving a blind black disc, punching a concentric scaled-down window (`innerTeardrop` / `innerEllipse` / `circleD(12,12,6.0)`) creates a bold solid frame and lets the cross strings or spokes sit cleanly inside the open window! |
| **6. Enclosed Interior Symbols & Stitches** (`slot-777`, `shield-verified`, `rugby-ball`, `passcode-pin`, `esports-gamepad`, `passkey`, `bet-early-payout`) | **Continuous Outer `fill: [body]` + `holeExact: [capsule(...) / bloatPoly(...)]` (+ `stroke: [shaft]`)** | The outer silhouette stays 100% unified while a single bold interior symbol (`77`, checkmark, lightning bolt, D-pad, keyring hole) is punched as a clean negative-space window. *(Note: in Line mode, complex interior polygons like the `bet-early-payout` lightning bolt or `archery-bow` broadhead should be **filled** `fill="currentColor" stroke="none"` so strokes don't self-overlap into blobs!)* |
| **7. Organic Folded & Multi-Lobe Objects** (`boxing-glove`, `shamrock-clover`, `bell-alert`) | **Continuous U-Cut (`boxing-glove`) or Separate Padded Lobes (`shamrock-clover` 3 circles, `bell-alert` dome + clapper)** | Preserves the exact outer silhouette while separating sub-parts (`3` padded `r=3.35` leaf discs for `shamrock-clover`; `2.2px` padded half-moon clapper below `bell-alert`; continuous U-thumb cut on `boxing-glove`). |
| **8. Stick-Figure Athletes, Bikes & Full-Stride Animals** (`road-cycling`, `moto-gp`, `downhill-skiing`, `athletics-sprint`, `swimming-crawl`, `greyhound-sprint`, `horse-knight`, `handball-throw`) | **`fill: [head, fairing]` + `face: [torsoHull.d]` + `tubes: [[limb, w], ...]` + `stroke: [wheels/skis/waves]`** | Why `road-cycling`, `swimming`, `hoop`, and the stick figures succeeded: the human/animal body fills solid, while thin companion apparatus (`wL`, `wR` wheels, `skis`, `waves`, `hoop` net) remains crisp `stroke` geometry so wheels and nets never turn into heavy black blobs! |

### Hard Rules & Learned Pitfalls from Mock 6 (102-Icon Surgical Precision Audit)
1. **NEVER Approximate Curved Hulls with Straight Polygon Chords or Pass `b = 0` to `bloatPoly` When `edgeBulge` Is Needed (`american-football` "Double-Sharpened Pencil" Trap):**
   - `bloatPoly(pts, r, b, { edgeBulge })` multiplies `edgeBulge[i]` by `b`! Passing `b = 0` zeroes out all edge curvature (`0 * edgeBulge = 0`), turning a 4-vertex barrel and 2 end triangles into straight-sided polygons that look like a pencil sharpened at both ends.
   - For curved prolate hulls split into 3 separate solid pieces (`american-football`), construct `tipBL`, `centerBarrel`, and `tipTR` using **true `A R R` SVG circular arcs** (`A 12.8 12.8`) evaluated at the **full outer boundary of the Outline stroke (`w_solid = w_line + s/2`)** so `face` shapes (`stroke="none"`) never look thinner than `fill`/Line shapes!
2. **NEVER Put Overlapping Loops in a Single `evenodd` Path String (`pool-eight-ball` Waist Clipping Trap):**
   - `face` and `over` render with `fill-rule="evenodd"`. If two overlapping rings (like the top loop `circleD(12, 9.5, 2.35) + circleD(12, 9.4, 1.05)` and bottom loop `circleD(12, 13.8, 2.65) + circleD(12, 13.9, 1.2)` of a figure-`8`) are concatenated into a **single** path string, their overlapping waist (`y = 11.15..11.85`) has winding number 2 (even!) and self-cancels into a white horizontal gap!
   - **Fix:** Pass overlapping rings as **separate array entries** in `over: [topRing, botRing]` so each `<path>` element evaluates its own inner hole independently and the waist overlap paints solid `currentColor` on `currentColor`.
3. **NEVER Use Square Boxy Knockouts or Unclosed Open-Chevron Strokes on Arrows Entering/Exiting Containers (`ui-log-out`, `ui-log-in`):**
   - Stroking only an open V-chevron (`M11 8.5 L14.6 12 L11 15.5`) in `knocks` leaves a triangular pocket behind the inner side of the arrowhead where the door frame peeks through; conversely, a `<rect>` punch looks boxy and inorganic.
   - **Fix:** Combine a **round-capped shaft capsule (`capsule(x0, y0, x1, y1, s * 1.28)`)** + a **closed, round-joined arrowhead wedge (`M9.4 8.0 L14.7 12.0 L9.4 16.0 Z`)** in both `holeExact` and `knocks` so the knockout hugs the arrow silhouette organically while clearing the pocket behind the chevron wings.
4. **NEVER Split a Small 3D Isometric Top Stud in Half (`bet-builder-lego`):**
   - On an isometric 3D Lego block, keep the raised cylindrical stud as **1 single unsplit solid shape (`over: [studSolid]`)** sitting inside a `studHalo` cutout on `topFace` (or merge the top diamond face and stud dome into a single continuous top crown piece). Never slice a small top stud with an extra horizontal gap line near its tip.
5. **Angle Directional Sports Equipment at `45°` & Use Authentic Silhouettes (`badminton-shuttle`, `darts-target`, `archery-bow`, `surfing-wave`):**
   - **Badminton Shuttlecock:** Tilt to `45°` (hemispherical cork nose pointing bottom-left `(4.6, 19.4)`, flared feather skirt opening top-right `(13.2, 3.2)–(20.8, 10.8)`), built from 2 separate padded shapes in Solid.
   - **Darts:** Build the **45° competition dart itself** (aerodynamic tail flight fin wings `finUpper` + `finLower`, `tangentHull2` tapered torpedo barrel with 2 grip ring cuts, and sharp needle point at `(20.6, 3.4)`), not a generic target circle.
   - **Archery:** Use `45°` upward-right aim with **symmetrical recurve bow limbs**, a **tensioned V-bowstring (`M4.6 8.2 L5.4 18.6 L15.8 19.4`)** drawn to the arrow nock, and a **filled triangular broadhead** (`fill="currentColor" stroke="none"`).
   - **Surfing Wave Bleed:** Mask both the surfboard hull and stringer line using a closed `waveClipBlock` (`M0 16.8 C... L24 16.4 V24 H0 Z`) + `wave1` stroke halo so zero surfboard lines ever bleed through the ocean waves.
   - **Small Circular Counter Details (`pool-eight-ball`, `bowling-strike`):** Never wrap a figure-8 inside an extra intermediate stroked ring in Line mode (keep loop radii `r = 2.1..2.4` wide open), and keep bowling ball finger holes at **`r ≥ 1.05` (`2.1px` diameter)** in both Line and Solid (`over: [ball + holes]`).
6. **Horizontal/Vertical Tangent Arrowheads & $G^1$ Curve-to-Head Alignment (`money-back-refund`, `tail-tipster`, `crash-plane`):**
   - **Never** attach an L-bracket arrowhead onto an off-angle circular or elliptical arc endpoint (`-135°` or `65°`), where the arc slices through the chevron and makes the arrowhead unrecognizable.
   - **Rule:** Always terminate curved arrows at a **purely vertical tangent (`0°`/`180°`, e.g. `(3.8, 12.0)` on `money-back-refund`)** or transition onto a **straight horizontal/45° segment (`H17.2` on `tail-tipster`)** so the `±45°` chevron wings align 100% symmetrically with the tangent vector.
   - For parabolic climb curves (`crash-plane`), lock the quadratic control point `P1(8.0, 16.0)` onto the **exact `45°` ray (`x + y = 24`)** leading into the tail notch `P2(14.6, 9.4)` of the symmetric `45°` delta head (`20.4, 3.6`) so the curve transitions with `0.00°` kink.
7. **Line-Mode Stroke Clearance Between Multi-Shape Polygons (`f1-monogram`, `baccarat-cards`):**
   - When an icon is built from multiple adjacent closed polygons that are **stroked** in Line mode (`s = 1.75..2.0px`, adding `s/2 ≈ 0.9px` outside each polygon edge) and **filled** (`stroke="none"`) in Solid mode:
   - A `1.8px` centerline gap leaves `1.8px` in Solid mode, but only `1.8 - 1.75 = 0.05px` in Line mode (causing the strokes to touch/collide!).
   - **Rule:** Maintain a **`3.2–3.6px` centerline gap** between separate closed polygons in Line mode (`fTopLine` at `y = 5.0..7.8` vs `fBotLine` at `y = 11.2..18.8` on `F1`; `crownLine` at `y = 2.8..7.8` vs `cardL_Line` at `y = 11.4..20.6` on `Baccarat`) so both Line and Solid have generous breathing room.
8. **Domain-Authentic Silhouettes Over Abstract Boxes (`gold-ingot`, `roulette-grid`, `baccarat`, `video-poker`, `slot-reels`, `coin-stack`, `liberty-bell`, `rg-stop-hand`, `golden-boot`):**
   - **Gold Bullion (`gold-ingot`):** Never draw 1 trapezoid with rays (looks like a ceiling lamp); draw a **1-on-2 Fort Knox pyramid of 3 separate padded trapezoidal ingots** (`face: [topM.d, botL.d, botR.d]`).
   - **Coin Stack (`coin-stack`):** Never draw 3 equal vertical cylinders (looks like a SQL database); place a **foreground circular coin (`15.4, 14.6, R = 5.2`)** in front of a left 3-coin stack.
   - **Roulette Table (`roulette-grid`):** Use a **landscape casino table (`18.8 × 14.0px`)** with the **Roulette Wheel (`r = 3.2`) on the left** and the **Betting Grid on the right** (split into `leftHalf.d` and `rightHalf.d` in Solid).
   - **Baccarat (`card-shoe`):** Use **3 separate padded shapes**: a **Royal 3-Peak Crown at top + 2 opposing dealt cards (`Player` Left & `Banker` Right) below**.
   - **Video Poker (`royal-flush`):** Combine a **Playing Card (`w = 12.4, h = 16.0`) containing a large `7.2 × 8.4px` Diamond Suit symbol** on the left with a **flared Video Camera Lens cone** on the right (`2` separate padded shapes in Solid).
   - **3-Reel Slot Machine (`jackpot-banner`):** Build **3 separate padded vertical reel drums (`r1.d, r2.d, r3.d`)** with aligned center payline cutouts + a **side pull lever & ball knob**.
   - **Cracked Liberty Bell (`liberty-bell`):** Use a **3-segment tapered Z-lightning fissure (`zigFissure`)** (`1.9px` wide at the bottom rim `y = 17.0`, zig-zagging through two opposing bends to a razor-sharp `0px` point at `(11.2, 7.5)`), never a single `<` corner or wide triangular bite.
   - **Golden Boot (`golden-boot`):** Split the boot in Solid into **2 separate padded shapes** (`heelQuarter.d` + `frontVamp.d` separated by a `1.6px` diagonal gap—zero knockout lines!) with compact **`1.5px` sole cleats**.
9. **4th Style (`color` — `fdsi-{name}-reg-color`) — Strict 3-Layer Z-Stack & Light/Dark Luminance Polarity:**
   - **Never** draw colored inner lines (`duotone.secondary`) on top of the outer boundary stroke (`out.line`), and never leave duplicate `secondary` paths inside `outerStroke`.
   - **Strict 3-Layer Z-Order (`tones + closedSecFills + innerLines + outerStroke`):**
     1. **Layer 1 (Very Back):** `tones` + `closedSecFills` (`100%` opaque fills `c1` / `c3` with `stroke="none"`).
     2. **Layer 2 (Middle — Under Outer Stroke):** `innerLines` (`duotone.secondary` stroked in high-contrast `c2`).
     3. **Layer 3 (Very Top — Highest Layer):** `outerStroke = extractOuterStroke(rawLine, secPaths)` (draws the `currentColor` outer boundary **last on top**, cleanly capping every T-junction where an inner line meets the outer wall).
   - **Inverted Luminance Polarity Between Light Mode (`#1c2026` dark outer stroke) and Dark Mode (`#e6edf3` white outer stroke):**
     - **Light Mode (`COLOR_PALETTES_LIGHT`):** Layer 1 (`c1` Back Fill) uses **luminous high-value pastels** (`#fde68a` Gold, `#a7f3d0` Mint, `#fecdd3` Rose, `#fed7aa` Apricot, `#bae6fd` Sky, `#e9d5ff` Lavender) so the dark `#1c2026` outer stroke has `>7:1` contrast, while Layer 2 (`c2` Inner Lines) uses **rich deep shades** (`#d97706`, `#059669`, `#e11d48`, `#ea580c`, `#0284c7`, `#7c3aed`) for `~4:1` contrast over `c1`.
     - **Dark Mode (`COLOR_PALETTES_DARK`):** Because the outer stroke is white (`#e6edf3`), pastel fills wash out and lose edge contrast! Invert the luminance polarity so Layer 1 (`c1` Back Fill) uses **deep jewel tones** (`#78350f` Bronze-Gold, `#064e3b` Forest Emerald, `#881337` Deep Ruby, `#7c2d12` Burnt Siena, `#0c4a6e` Deep Sapphire, `#4c1d95` Deep Amethyst — `~5:1` contrast against white `#e6edf3` outer strokes!), and Layer 2 (`c2` Inner Lines) uses **vivid luminous accents** (`#facc15`, `#34d399`, `#fb7185`, `#fb923c`, `#38bdf8`, `#c084fc`) that pop brightly over the deep jewel-tone fills.

---

## 4. Two-Class Modifier System (`engine/modifiers.js`)

Modifiers live in the `10×10` corner slot (`br | tr | bl | tl`, extending to `22.25` in the outer `2px` overshoot band) and are **always rendered as solid badges in both Line and Solid modes** for clear visual hierarchy:

1. **Class 1 — In Round Circle (`plus`, `minus`, `check`, `clock`, `prohibit`, `info`, `alert`):**
   - All sit inside the canonical `BADGE` disc (`<circle cx="18" cy="18" r="4.25"/>`) with the inner glyph punched out via `<mask>`.
   - `prohibit` (`blocked`) uses a contained `45°` diagonal slash (`M16.35 16.35 19.65 19.65`) strictly inside the `r = 4.25` disc so it never bleeds past the circle rim.
2. **Class 2 — Outside / Freeform (`star`, `sparkle`, `flame`, `lock`, `key`):**
   - Not enclosed in a circle.
   - `star` uses `bloatPoly` with `r = 0.38` on outer tips and `r = 0.2` on inner valleys, and `compiler.js` strokes the knockout `<mask>` with `stroke-linejoin="round" stroke-linecap="round"` (`gap = 2.2 * sw`) so the cutout hugs the star contour with smooth rounded lobes (never a circular hole and never sharp miter spikes).
   - `flame` (`#F97316` orange) scales our approved `hot-flame` circular-arc hull (`M15.1 19.2 A3.4 3.4 0 0 0 21.9 19.2 A6.0 6.0 0 0 0 19.0 13.3 A3.4 3.4 0 0 0 17.5 17.0 A2.4 2.4 0 0 1 16.3 15.4 A5.0 5.0 0 0 0 15.1 19.2 Z`) into the `10×10` modifier slot with an inner teardrop core cutout (`M17.1 19.7 A1.4 1.4 0 0 0 19.9 19.7 A2.6 2.6 0 0 0 18.5 17.2 A2.6 2.6 0 0 0 17.1 19.7 Z`), using `knockout` on the outer flame silhouette so the subject never bleeds through the inner flame core.
   - **Critical SVG `<mask>` Rule (`maskUnits="userSpaceOnUse"`):** Every `<mask>` element MUST include `maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"`. Without it, SVG defaults to `maskUnits="objectBoundingBox"` (`-10%` to `110%`), which clips the outer stroke boundary of small circles (`r ≤ 3.5`, such as `pot-of-gold` coins)!

---

## 5. Validated Category Recipes & Templates

### A. 3D Isometric Balls (`football`, `champions-league`)
Never place a polygon or star dead-center at `(12, 12)` with straight radial spokes (which reads as a flat wheel or coin).
- Shift the hero patch **up-left to `(10.6, 10.4)`**, foreshorten its upper edges, fill it in Line mode (`holes: [patch]` in Solid), and curve the 5 radiating seams with quadratic `Q` arcs wrapping to asymmetric points on the `r = 9` circle:

```js
const ball = circleD(12, 12, 9);
const P5 = bloatPoly([[11.2,7.2],[14.2,9.4],[13,13],[9.2,13],[8,9.4]], Math.min(t.r*0.35,0.7), t.b*0.4, {minEdge:2.2, inset:0.4});
const seams = 'M8 9.4Q5.5 8.2 4.2 7M11.2 7.2Q10.5 4.8 9.8 3M14.2 9.4Q17.5 9.8 20.8 11.8M13 13Q15.2 16.5 14.5 20.5M9.2 13Q6.8 15.8 6.8 19.6';
// line(t): ball + filled P5.d + seams
// solid(t): solidFaces([{ fill: ball, holes: [P5.d], cuts: [seams] }], t)
```

### B. Stylized Athlete Pictograms (`cycling`, `athletics`, `swimming`, `alpine-skiing`, `weightlifting`)
1. **Expressive Head Circle:** `r = 2.2..2.35` (`circleD(cx, cy, r)`), placed `≥ 1.2px` clear of the shoulders.
2. **Tapered Tangent-Hull Torso (`tangentHull2(shoulderCircle, hipCircle)`):**
   - Use `tangentHull2([sx, sy], rShoulder, [hx, hy], rHip)` (`engine/core.js`, e.g. `rShoulder = 1.35..1.45` tapering to `rHip = 1.0`) to connect the shoulder circle and hip circle at their exact trigonometric external bitangents ($\theta = \text{atan2}(\Delta y, \Delta x) \pm \arccos((r_1 - r_2)/d)$).
3. **Soft-Filleted Limb Joints (`roundOpen(pts, jr)`):** Pass every multi-segment limb chain (`shoulder → elbow → hand`, `hip → knee → foot`) through `roundOpen(pts, Math.max(1.3, t.r * 0.85))`.
4. **Pure Vector Athlete Body (`fill` + `face` + `tubes`, NEVER `outline()` or `solidFaces()`):**
   - **CRITICAL:** Never call `outline(fills, tubes)` or `solidFaces(layers, t)` from `construct.js`!
   - **Line Mode:** Keep the **human head circle hollow/outlined** (`<path d="${head}"/>`), render the **tapered `torsoHull.d` filled** (`<path d="${torsoHull.d}" fill="currentColor" stroke="none"/>`), and render the **`roundOpen` limbs** as native vector strokes (`stroke-width="${f(t.s + 0.25)}"`).
   - **Solid Mode:** Fill the **head circle and torso solid** (`fill: [head], face: [torsoHull.d]`) and pass the limbs in `tubes: [[arm, t.s + 0.1], [leg, t.s + 0.35]]`.

```js
// Gold-Standard Pictogram Template: Road Cycling (100% Pure Analytical SVG Curves)
const wL = circleD(5.8, 17.2, 3.5), wR = circleD(18.2, 17.2, 3.5), head = circleD(15.2, 4.6, 2.2);
const torsoHull = tangentHull2([12.4, 7.8], 1.35, [8.0, 11.2], 1.0);
const arm = 'M12.4 7.8L15.0 10.6H18.0';
const leg = roundOpen([[8.0, 11.2], [12.0, 14.0], [10.2, 18.0]], 1.4);
// line(t):  { els: `<path d="${wL}"/><path d="${wR}"/><path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${arm}"/><path d="${leg}" stroke-width="${f(t.s + 0.25)}"/>` }
// solid(t): { fill: [head], face: [torsoHull.d], tubes: [[arm, t.s + 0.1], [leg, t.s + 0.35]], stroke: [wL, wR] }
```

### C. Organic Animals, Ogive Rockets & Gamepads (`greyhound-sprint`, `crash-rocket`, `esports-gamepad`, `boxing-glove`)
1. **Gold-Standard Full-Stride Animals (`greyhound-sprint` & `horse-knight`):**
   - **Sprinting Greyhound (`greyhound-sprint`):** Build the torso as a **filled closed shape** from intersecting circular arcs (`R = 9.5` arched spine, `R = 3.5` deep brisket chest, `R = 4.2` concave whippet abdominal waist tuck, `R = 1.0` pointed snout, swept ear) in both Line and Solid modes, paired with **`roundOpen(pts, 1.4)` 2-segment extension legs** (`[[14.8, 12.4], [18.2, 15.2], [21.2, 14.8]]` and `[[6.8, 11.8], [4.2, 15.2], [2.2, 16.5]]`) + a circular-arc whip tail (`A 4.5 4.5`).
   - **Galloping Horse (`horse-knight` & `horse-jockey` — Thick Rounded Barrel + Tapered Circle-Thigh Hindquarter + Short Straight Far-Leg Ticks):**
     - Unlike a greyhound (which has a tucked whippet waist), a horse must have a **thicker, full-bodied rounded back and barrel** (`M5.8 9.2 Q9.8 8.5 13.5 8.8 ... C13.5 14.6 9.0 14.6 6.2 13.4 A2.2 2.2 0 0 1 5.8 9.2 Z` — `4.5px` deep barrel).
     - **Tapered Muscular Rear Thigh (`tangentHull2`):** A horse's hind leg has a powerful muscular thigh (stifle/gaskin) at the top that tapers down to the hock. Build it with **`tangentHull2([7.0, 12.2], 2.2, [4.6, 15.5], 0.85)`** (an `r = 2.2` circle at the top of the hindquarter tapering down into an `r = 0.85` hock circle), with the lower cannon bone extending from `(4.6, 15.5)` to `(2.4, 18.2)`.
     - **4-Leg Equine Rule (2 Primary Attached + 2 Short Straight Detached Ticks):** Draw the near foreleg extending at a gentle downward-forward stride (`roundOpen([[14.8, 13.2], [17.4, 15.8], [18.8, 17.8]], 1.4)` — less bent forward), and draw the **2 far-side legs as short (`~1.8px`), straight (unbent) representative ticks** tucked close alongside the front and rear legs (`farFore = "M13.8 15.5 L14.9 17.0"` and `farHind = "M7.2 16.0 L6.0 17.4"`).
   - **Diving Falcon / Bird (`falcon-head`):** Uses the same filled-body + detached-limb rule: filled streamlined raptor body + hooked beak (`body`) paired with 2 swept wing strokes (`wingMain` attached, `wingFar` detached) and a tail stroke.
2. **Intersecting Equal-Radius Ogives (`crash-rocket`, `slot-cherries`, `hot-flame`):**
   - Never hand-guess cubic Béziers for pointed symmetric hulls, leaves, or flames. Use **intersecting SVG circular arcs (`A R R`)** (`A 13.5 13.5` for a 45° rocket fuselage; `A 4.2 4.2` for a vesica piscis cherry leaf; `A 6.5 6.5` base + `A 11.5 11.5` / `A 9.5 9.5` walls for a flame).
3. **4-Circle Tangent Gamepad (`esports-gamepad`):**
   - Build dual-grip controllers from 2 circular face lobes `C_L(6.8, 10.8, R=4.0)` & `C_R(17.2, 10.8, R=4.0)` tangent into 2 circular grip horn tips `C_HL(5.0, 17.0, r=2.1)` & `C_HR(19.0, 17.0, r=2.1)` with a flat center bridge at `y = 14.2`, placing the D-pad and buttons at the exact centers of the `R = 4.0` lobes.
4. **Boxing Glove (`boxing-glove-pro` — Dome Arc + Continuous U-Thumb Cut):**
   - Build the mitt from a `R = 6.2` knuckle dome arc + `R = 2.6` thumb bolster arc + `bloatRect` cuff. In Solid mode, keep the continuous U-shaped thumb cut (`M5.5 7.6 H11.2 A2.4 2.4 0 0 1 11.2 12.4 H8.5`) and shifted cuff (`y = 16.5`) rather than detaching the thumb into an isolated floating pill.

### D. Vehicles & Seasonal / League Totems (`formula-1`, `moto-gp`, `halloween-pumpkin`, `xmas`, `pot-of-gold`)
- **Formula 1 (`formula-1`):** Use a **top-down open-wheel bolide plan view** (wide swept front wing `4.5..19.5`, needle nose cone, 4 exposed wide slicks `bloatRect` on horizontal wishbone struts, flared sidepods tapering to a coke-bottle rear, cockpit helmet at `(12, 12.8)`, and rear wing) so the wheels never swallow a `4px`-tall side chassis.
- **MotoGP (`moto-gp`):** Layer 0 = tucked rider (`rHead` + `rBody`), Layer 1 = exposed front & rear tires (`wRear`, `wFront` with hub holes), Layer 2 = angled sportbike fairing + upswept tail.
- **Seasonal Totems:** Single bloated silhouette (`bloatPoly`) + expressive interior cutouts (`halloween-pumpkin` inward-slanted angry eyes + zig-zag fang mouth; `xmas` fluffy `bloatRect` fur brim + drooping Santa cap cone + `r=2.2` pom-pom; `pot-of-gold` cauldron + 2-tier pyramid of 6 overlapping coin arcs).

### E. T-Junctions on Curved Rims & Closed Hoops (NEVER Use Floating Hardcoded `y` Coordinates!)
- **The T-Junction Protrusion Bug:** When a net cord, spoke, or strap is supposed to hang from a curved elliptical rim (`ellipse(cx, cy, rx, ry)`) or connect between two angled walls (`xL(y)` and `xR(y)`):
  - If you hardcode `M 8.5 13.8` when the elliptical rim at `x = 8.5` is actually at `y = 13.94`, the round stroke cap (`r = s / 2`) pokes **above** the rim as an ugly bump!
  - If you draw `s.clip` (`<path d="${s.clip}"/>`) over `s.under`, it closes the bottom of an open dome into a heavy D-shape!
  - If two diagonal net cords cross near the bottom (`y = 18.8`) and both stop at `y = 20.8`, their bottom round caps fuse into a clunky M-shaped claw.
- **The 3 Exact Geometric Fixes:**
  1. **Use `ellipseY(cx, cy, rx, ry, x, 'bottom' | 'top')` (`engine/core.js`):** Always compute the exact $y$ coordinate on the ellipse at $x$ (`const yStart = ellipseY(12, 11.8, 7.8, 2.4, 8.2, 'bottom')`) so every hanging cord starts on the **exact mathematical centerline** of the curved rim.
  2. **Linear Wall Interpolation for Slanted Containers:** When a horizontal arc spans between two slanted side lines $(x_0, y_0) \to (x_1, y_1)$, compute $x(y) = x_0 + (x_1 - x_0)\frac{y - y_0}{y_1 - y_0}$ so the horizontal cord starts and ends **exactly on the slanted side lines** with zero overhang.
  3. **Meet Diagonal Cords on the Outer Walls or Bottom Rim Corners:** On tapered nets (`basketball-basket`), run the diagonal mesh cords from the top rim (`x = 8.2, 15.8`) to the **exact bottom-right and bottom-left net corners** (`(16.2, 20.5)` and `(7.8, 20.5)`) so they cross cleanly in the center of the net (`y = 16.5`) and merge into the side walls at the bottom instead of forming 4 crowded tips at the bottom.

---

## 6. Modular Workbench Mini-App & Multi-Agent File Contract (`apps/workbench/`)

When authoring or editing icons (including with parallel Gemini agents), work directly in the **Modular Workbench Mini-App** (`pnpm workbench` -> `http://localhost:4650`):
1. **1 File Per Icon by Area (`apps/workbench/src/icons/<area>/<slug>.js`):**
   - Areas: `common`, `sb`, `gx`, `payments`, `bx`
   - Every icon is a standalone ES module that imports its geometry helpers from `../../engine/primitives.js` and exports default `{ id, slug, name, area, order, desc, meta, build }`:
     ```js
     import { f, P, polar, circleD, capsule, bloatRect, bloatPoly, facePoly, drawKeylines } from "../../engine/primitives.js";

     export default {
       id: "my-icon-id",
       slug: "my-icon",
       name: "My Icon Title",
       area: "sb",
       order: 223,
       desc: "Technical geometry summary.",
       meta: {
         slug: "my-icon",
         area: "sb",
         alias: "",
         crsKey: "",
         description: "Semantic usage description for designers and developers.",
         tags: ["my-icon", "sportsbook"]
       },
       build: ({ s, r, b }) => {
         return {
           keylines: drawKeylines([[12, 12, 9]], []),
           line: `...`,
           solid: { face: [...] },
           duotone: { tone: [...], secondary: [...], line: `...` }
         };
       }
     };
     ```
2. **Zero-Conflict Multi-Agent Hot Reload:**
   - `apps/workbench/server.mjs` watches `apps/workbench/src/icons/<area>/*.js` via `fs.watch` + SSE (`/api/events`). Creating or editing any `.js` file hot-reloads the Workbench UI automatically without manual index registration.
3. **1-Click Flatten & Publish to `fdsi-fig2global`:**
   - Click **"🚀 Publish Flattened SVGs to fdsi-fig2global"** in the Workbench header (or run `pnpm export:fig2global` / `node scripts/export-to-fig2global.mjs`) to flatten all modular icons with `pathkit-wasm` + `svgo` and publish them to `/Users/kama10/Documents/fdsi_core_iconograpy_resources`.

---

## 6B. Legacy MCP Workflow in Icon Studio

When connected to Icon Studio via MCP (`icon-studio-*` tools):
1. Call `get_context`, then `get_subject` and `get_thread` for the target draft `id`.
2. Write the subject as a `{ ... }` block calling `ICON.add({ id, name, group, bloat, iso, size, slots, def, line(t), solid(t) })`.
   - **Important:** `solid(t).stroke` entries must be **raw path `d` strings** (e.g. `stroke: [pole]`), **never** `<path d="..."/>` markup (markup inside `solid().stroke` produces an invalid `<path d="<path..."/>` and renders a blank solid!).
3. Run `build_draft` (`svg: false` while iterating) until `checks` reports `bad: 0, zone: 0`.
4. Call `render_preview` to inspect all presets (`flat`, `soft`, `plump`) in both `line` and `solid` at `24px` and `16px` (this also pushes a live sketch to the Studio stage).
5. Call `submit_version` with a concise 1-sentence `summary` and `replyTo` set to the designer's message ID.

## 7. Vector Flattening (`pathkit-wasm` + `svgo`) & Dynamic Modifier Architecture (`scripts/export-to-fig2global.mjs`)

When flattening stroked/masked SVGs with Skia PathOps (`pathkit-wasm`) and optimizing with `svgo`:
- **Always emit `fill-rule="evenodd" clip-rule="evenodd"`** on any `<path>` produced by `PathOp.DIFFERENCE`, `PathOp.UNION`, `PathOp.INTERSECT`, or `PK.FillType.EVENODD`. Skia outputs inner hole contours with the **same winding direction** as outer contours; omitting `fill-rule="evenodd"` causes SVG's default `nonzero` rule to fill every inner hole solid black (`pool-eight-ball`, `playing-cards`, `coins`, `sgp-linked-rings`).
- **Never `PathOp.UNION` across separate `<path>` layers & set `mergePaths: false` / `convertPathData: false` in SVGO:** Merging separate shapes that touch tangentially at a conic endpoint (`casino-chip`, `roulette-wheel`) drops the outer ring contour, and SVGO's `convertPathData` rewrites `PathKit`'s `Q ... L ... Q` tangent sequences into `t` smooth quadratics with reflected control points.
- **Masked Closed Ring Strokes (`eye-hidden` pupil):** When a closed ring stroke (`strokeSubs.length === 2`) is cut by a `<mask>`, separate `outer` and `inner` by bounding-box area, degree-elevate `Q` conics to cubic `C` (`quadToCubicInSvg`), union `inner` with the mask (`holeUnion = inner ∪ maskCubic`), and subtract `outer - holeUnion`.
- **Dynamic Subject + Modifier Architecture (232 Repo Icons = 222 Base + 10 Standalone `fdsi-mod-*`):**
  - Never pre-bake arbitrary `subject × modifier` pairs on disk. Store the **222 base icons** and **10 standalone `fdsi-mod-*` badges** in `core/`, and export `storybook/src/generated/modifiers.ts` and `figma-sync/src/main/modifiers.ts` containing each modifier's flattened `maskCutMarkup` (`1.8px` corner knockout), `invertedMaskD` (`24×24 minus 1.8px halo`), and semantic `badgeMarkup`.
  - **Frontend (`<fds-icon>`):** In `<fds-icon name="..." modifier="plus|check|flame|...">`, dynamically wrap the base icon's inner paths in `<g mask="url(#...)">` using `maskCutMarkup` and append `badgeMarkup` on top so **any of the 222 icons works with any of the 10 modifiers** across all 4 styles (`outline`, `solid`, `duotone`, `color`).
  - **Figma (`figma-sync`):** Wire two Component Properties onto every base icon `ComponentSet` (`Show Modifier` `BOOLEAN` default `false` + `Modifier` `INSTANCE_SWAP` default `fdsi-mod-plus`). Inside each variant `ComponentNode`, group the base vectors inside a `Base Artwork` `GroupNode` with an inverted `24×24 minus 1.8px halo` vector mask (`Modifier Cutout Mask`, `isMask = true`, `maskType = "VECTOR"`) at index 0 bound to `Show Modifier`, and place the `24×24` `Modifier` instance above `Base Artwork` bound to `Show Modifier` and `Modifier`. Using a `GroupNode` stops mask propagation before the `Modifier` instance while keeping `exportAsync({ format: "SVG_STRING" })` identical when `Show Modifier` is `false`.


