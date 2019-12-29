export default (h0, s, v) => {
  let h = h0 * 360;
  var R, G, B, X, C;
  h = (h % 360) / 60;
  C = v * s;
  X = C * (1 - Math.abs((h % 2) - 1));
  R = G = B = v - C;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];

  return { r: R, g: G, b: B };
};
