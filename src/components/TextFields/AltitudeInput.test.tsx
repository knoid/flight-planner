import { validation } from './AltitudeInput';

test('validation', () => {
  expect(validation.test('')).toBeTruthy();
  expect(validation.test('F')).toBeTruthy();
  expect(validation.test('FL')).toBeTruthy();
  expect(validation.test('FL0')).toBeTruthy();

  expect(validation.test('G')).toBeFalsy();
});
