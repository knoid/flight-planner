import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useStore } from './store';

export default function CruiseSpeedInput() {
  const { setCruiseSpeed, cruiseSpeed: savedCruisedSpeed } = useStore();
  const [rawCruiseSpeed, setRawCruiseSpeed] = useState(savedCruisedSpeed > 0 ? savedCruisedSpeed.toString() : '');
  const cruiseSpeed = Number(rawCruiseSpeed);

  const isValid = !isNaN(cruiseSpeed);
  useEffect(() => {
    setCruiseSpeed(cruiseSpeed)
  }, [cruiseSpeed, setCruiseSpeed])

  return (
    <TextField
      error={!isValid}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      label="Cruise speed"
      onChange={(event) => setRawCruiseSpeed(event.currentTarget.value)}
      value={rawCruiseSpeed}
    />
  );
}
