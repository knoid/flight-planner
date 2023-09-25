import { FuelUnit } from './store';

export default new Map<FuelUnit, string>([
  [FuelUnit.GallonUS, 'gal'],
  [FuelUnit.Liter, 'lts'],
  [FuelUnit.Pound, 'lbs'],
]);
