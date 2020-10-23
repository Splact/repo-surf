const round = x => (x + 0.5) | 0;

const rgb2hex = (r, g, b) =>
  "#" +
  (16777216 | round(b * 255) | (round(g * 255) << 8) | (round(r * 255) << 16))
    .toString(16)
    .slice(1);

export default rgb2hex;
