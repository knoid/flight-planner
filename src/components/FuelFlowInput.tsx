import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useStore } from './store';

export default function FuelFlowInput() {
  const { setFuelFlow, fuelFlow: savedValue } = useStore();
  const [rawValue, setRawValue] = useState(savedValue > 0 ? savedValue.toString() : '');
  const value = Number(rawValue);

  const isValid = !isNaN(value);
  useEffect(() => {
    setFuelFlow(value);
  }, [value, setFuelFlow]);

  return (
    <TextField
      error={!isValid}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9.,]*' }}
      label="Fuel Flow"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
