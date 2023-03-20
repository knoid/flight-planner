import { useEffect, useState } from 'react';
import { useStore } from '../store';
import FuelTextField from './FuelTextField';

export default function FuelReserveInput() {
  const { setFuel, fuel } = useStore();
  const [rawValue, setRawValue] = useState(fuel.reserve > 0 ? fuel.reserve.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setFuel({ reserve: value });
  }, [value, setFuel]);

  return (
    <FuelTextField
      inputProps={{ pattern: '[0-9.,]*' }}
      label="Fuel Reserve"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
