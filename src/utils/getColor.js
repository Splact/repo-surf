import hsb2rgb from "./hsb2rgb";
import rgb2hex from "./rgb2hex";
const COLOR_STEP = 0.25;
let color = { h: 0.275766017, s: 0.49, b: 0.8 }; // #8ACB67

export default () => {
  const rgb = hsb2rgb(color.h, color.s, color.b);

  // calc next
  color.h += COLOR_STEP;
  if (color.h > 1) {
    color.h = 0;
  }

  return rgb2hex(rgb.r, rgb.g, rgb.b);
};
