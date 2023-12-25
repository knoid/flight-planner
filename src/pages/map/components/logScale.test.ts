import { linear, log } from './logScale';

test('log', () => {
  expect(log(10)).toBe(1500);
  expect(linear(1500)).toBe(10);
});
