import { useEffect, useState } from 'react';
import { useStore } from '../store';
import NumericTextField from './NumericTextField';

export default function FuelCapacityInput() {
  const { setFuelCapacity, fuelCapacity: savedValue } = useStore();
  const [rawValue, setRawValue] = useState(savedValue > 0 ? savedValue.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setFuelCapacity(value);
  }, [value, setFuelCapacity]);

  return (
    <NumericTextField
      inputProps={{ pattern: '[0-9.,]*' }}
      label="Fuel Capacity"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}