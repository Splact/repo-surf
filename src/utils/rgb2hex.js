const round = x => (x + 0.5) | 0;

export default (r, g, b) =>
  "#" +
  (16777216 | round(b * 255) | (round(g * 255) << 8) | (round(r * 255) << 16))
    .toString(16)
    .slice(1);
