import { useEffect, useState } from 'react';
import { useStore } from '../store';
import NumericTextField from './NumericTextField';

export default function FuelFlowInput() {
  const { setFuelFlow, fuelFlow: savedValue } = useStore();
  const [rawValue, setRawValue] = useState(savedValue > 0 ? savedValue.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setFuelFlow(value);
  }, [value, setFuelFlow]);

  return (
    <NumericTextField
      inputProps={{ pattern: '[0-9.,]*' }}
      label="Fuel Flow"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
