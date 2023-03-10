import { useEffect, useState } from 'react';
import { useStore } from '../store';
import FuelTextField from './FuelTextField';

export default function FuelCapacityInput() {
  const { setFuel, fuel } = useStore();
  const [rawValue, setRawValue] = useState(fuel.capacity > 0 ? fuel.capacity.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setFuel({ capacity: value });
  }, [value, setFuel]);

  return (
    <FuelTextField
      inputProps={{ pattern: '[0-9.,]*' }}
      label="Fuel Capacity"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
