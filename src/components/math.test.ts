import { expect, test } from 'vitest';

import { toDegrees, toRadians } from './math';

test('toDegrees', () => {
  expect(toDegrees(-Math.PI / 2)).toBeCloseTo(-90);
  expect(toDegrees(Math.PI / 2)).toBeCloseTo(90);

  expect(toDegrees(-2.5 * Math.PI)).toBeCloseTo(-90 - 360);
  expect(toDegrees(2.5 * Math.PI)).toBeCloseTo(90 + 360);
});

test('toRadians', () => {
  expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2);
  expect(toRadians(90)).toBeCloseTo(Math.PI / 2);

  expect(toRadians(-90 - 360)).toBeCloseTo(-2.5 * Math.PI);
  expect(toRadians(90 + 360)).toBeCloseTo(2.5 * Math.PI);
});
