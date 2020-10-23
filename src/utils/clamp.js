const clamp = (v, { min, max }) => {
  let result = v;

  if (min !== undefined && result < min) {
    v = min;
  } else if (max !== undefined && result > max) {
    v = max;
  }

  return result;
};

export default clamp;
