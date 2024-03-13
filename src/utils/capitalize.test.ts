import { expect, test } from 'vitest';

import { capitalize } from './capitalize';

function testString(input: string) {
  return capitalize(input).normalize('NFC');
}

test('capitalize', () => {
  expect(testString('GENERAL RODRÍGUEZ')).toBe('General Rodríguez');
  expect(testString('LA LAJA')).toBe('La Laja');
  expect(testString('ALTO RÍO SENGUER')).toBe('Alto Río Senguer');
});
