// Rich Non-Semantic Illustrated Palettes for the 4th Style ("color"):
// Strict 3-Layer Z-Order:
//   Layer 1 (Very Back):  c1 (Luminous high-value fill) & c3 (Contrasting second-part fill) — 100% opaque, stroke="none"
//   Layer 2 (Middle):     c2 (Rich high-contrast inner lines / secondary details, drawn UNDER the outer stroke!)
//   Layer 3 (Very Top):   Outer stroke in `currentColor`, drawn LAST on the highest layer so it cleanly caps all inner line endpoints!
export const COLOR_PALETTES_LIGHT = {
  gold: ["#fde68a", "#d97706", "#fbbf24"],
  emerald: ["#a7f3d0", "#059669", "#34d399"],
  crimson: ["#fecdd3", "#e11d48", "#fb7185"],
  orange: ["#fed7aa", "#ea580c", "#fb923c"],
  sky: ["#bae6fd", "#0284c7", "#38bdf8"],
  violet: ["#e9d5ff", "#7c3aed", "#c084fc"],
  amberRed: ["#fef08a", "#e11d48", "#fb7185"],
  melon: ["#fda4af", "#059669", "#34d399"],
};

export const COLOR_PALETTES_DARK = {
  gold: ["#78350f", "#facc15", "#b45309"],
  emerald: ["#064e3b", "#34d399", "#047857"],
  crimson: ["#881337", "#fb7185", "#be123c"],
  orange: ["#7c2d12", "#fb923c", "#c2410c"],
  sky: ["#0c4a6e", "#38bdf8", "#0369a1"],
  violet: ["#4c1d95", "#c084fc", "#6d28d9"],
  amberRed: ["#713f12", "#fb7185", "#be123c"],
  melon: ["#881337", "#34d399", "#047857"],
};

export function getColorPalette(id, isDark = false) {
  const P = isDark ? COLOR_PALETTES_DARK : COLOR_PALETTES_LIGHT;
  if (/cherries|melon/.test(id)) return P.melon;
  if (/booking-cards|offside-flag|rg-stop-hand|rg-hourglass|tournament-hourglass/.test(id)) return P.amberRed;
  if (/bell|crown|trophy|medal|coin|bullion|ingot|star|key|padlock|lock|horseshoe|treasure|chest|megaphone|lemon|bingo|wheel-of-fortune|jackpot|podium/.test(id))
    return P.gold;
  if (/warn|flame|fire|boost|flash-bet|crash|hot|basketball|american-football|horse|greyhound|falcon|clay/.test(id))
    return P.orange;
  if (/clover|pitch|golf|tennis|squash|wallet|deposit|withdraw|cash-out|money-back|slip|placed|acca|free-kick|penalty|goal|soccer|futsal|aussie|rugby|cricket|table-tennis|roulette-grid|baccarat/.test(id))
    return P.emerald;
  if (/heart|spade|suit-heart|suit-diamond|glove|mma|slot|777|roulette-wheel|chip|dice|cards|blackjack|poker|hi-lo|bomb|mines|target|dart|archery|bowling|curling|f1|formula|moto|speedway|helmet|barbell|wrestling|belt|hurdle|boot|magnet/.test(id))
    return P.crimson;
  if (/vip|martini|dealer|bowtie|sic-bo|plinko|keno|scratch|spins|multiplier|gamepad|mystery|parachute|streak|tipster/.test(id))
    return P.violet;
  return P.sky;
}
