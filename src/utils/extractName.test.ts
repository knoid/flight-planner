import extractName from './extractName';

test('extractName', () => {
  expect(extractName('CALCHAQUÍ – (CCI) - DRNE')).toBe('CALCHAQUÍ');
  expect(extractName('CAÑADA / BIONDI – (CDL) - DRNO')).toBe('CAÑADA / BIONDI');
  expect(extractName('CÓRDOBA / ESCUELA DE AVIACIÓN MILITAR - (ESC / SACE) – FIR CBA - MILITAR CONTROLADO (HABILITADO POR LA FUERZA AÉREA ARGENTINA)')).toBe('CÓRDOBA / ESCUELA DE AVIACIÓN MILITAR');
});
