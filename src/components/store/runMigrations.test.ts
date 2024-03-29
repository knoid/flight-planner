import { nanoid } from 'nanoid';
import { expect, test } from 'vitest';

import { version } from './constants';
import runMigrations from './runMigrations';

test('create new empty state', () => {
  const data = runMigrations();
  expect(data).toHaveProperty('version', version);
  expect(data.legs).toHaveLength(0);
});

test('fixes legs', () => {
  const data = runMigrations({
    legs: [{ _id: nanoid() }, {}, { _id: nanoid(), wind: '12' }, undefined],
    version: 1,
  });
  expect(data.legs).toHaveLength(2);
  expect(data.legs[0]).toHaveProperty('wind', '');
  expect(data.legs[1]).toHaveProperty('wind', '12');
});
