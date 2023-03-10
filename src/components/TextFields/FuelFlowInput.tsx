import { useEffect, useState } from 'react';
import { useStore } from '../store';
import FuelTextField from './FuelTextField';

export default function FuelFlowInput() {
  const { fuel, setFuel } = useStore();
  const [rawValue, setRawValue] = useState(fuel.flow > 0 ? fuel.flow.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setFuel({ flow: value });
  }, [value, setFuel]);

  return (
    <FuelTextField
      inputProps={{ pattern: '[0-9.,]*' }}
      label="Fuel Flow"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
