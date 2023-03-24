import { InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../components/store';
import NumericTextField from './NumericTextField';

const inputProps = { pattern: '[0-9]*' };
const InputProps = { endAdornment: <InputAdornment position="end">kt</InputAdornment> };

export default function CruiseSpeedInput() {
  const { setCruiseSpeed, cruiseSpeed: savedValue } = useStore();
  const [rawValue, setRawValue] = useState(savedValue > 0 ? savedValue.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setCruiseSpeed(value);
  }, [value, setCruiseSpeed]);

  return (
    <NumericTextField
      inputProps={inputProps}
      InputProps={InputProps}
      label="Cruise speed"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
