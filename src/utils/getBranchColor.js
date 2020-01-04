import hsb2rgb from "./hsb2rgb";
import rgb2hex from "./rgb2hex";
const COLOR_STEP = 0.2222;
const BASE_COLOR = { h: 0.275766017, s: 0.49, b: 0.8 }; // #8ACB67

export default index => {
  let h = BASE_COLOR.h + COLOR_STEP * index;
  let s = BASE_COLOR.s;
  const b = BASE_COLOR.b;

  while (h > 1) {
    h -= 1;
    s -= 0.1;
  }

  while (s < 0) {
    s += 1;
  }

  const rgb = hsb2rgb(h, s, b);
  return rgb2hex(rgb.r, rgb.g, rgb.b);
};
