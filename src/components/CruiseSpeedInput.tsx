import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useStore } from './store';

export default function CruiseSpeedInput() {
  const { setCruiseSpeed, cruiseSpeed: savedValue } = useStore();
  const [rawValue, setRawValue] = useState(savedValue > 0 ? savedValue.toString() : '');
  const value = Number(rawValue);

  const isValid = !isNaN(value);
  useEffect(() => {
    setCruiseSpeed(value);
  }, [value, setCruiseSpeed]);

  return (
    <TextField
      error={!isValid}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      label="Cruise speed"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
