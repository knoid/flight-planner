// position will be between 0 and 100
const minp = 0;
const maxp = 100;

// The result should be between 1000 an 50000
const minv = Math.log(1000);
const maxv = Math.log(50 * 1000);
const step = 500;

// calculate adjustment factor
const scale = (maxv - minv) / (maxp - minp);

export function log(position: number) {
  const value = Math.exp(minv + scale * (position - minp));
  return Math.round(value / step) * step;
}

export function linear(value: number) {
  return Math.round((Math.log(value) - minv) / scale + minp);
}
