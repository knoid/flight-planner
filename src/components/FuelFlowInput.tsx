import { useEffect, useState } from 'react';
import NumericTextField from './NumericTextField';
import { useStore } from './store';

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
