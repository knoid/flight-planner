import { capitalize } from "./capitalize"

test('capitalize', () => {
  expect(capitalize('GENERAL RODRÍGUEZ')).toBe('General Rodríguez');
})