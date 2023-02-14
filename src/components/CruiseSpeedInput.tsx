import { useEffect, useState } from 'react';
import NumericTextField from './NumericTextField';
import { useStore } from './store';

export default function CruiseSpeedInput() {
  const { setCruiseSpeed, cruiseSpeed: savedValue } = useStore();
  const [rawValue, setRawValue] = useState(savedValue > 0 ? savedValue.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setCruiseSpeed(value);
  }, [value, setCruiseSpeed]);
  
  return (
    <NumericTextField
      inputProps={{ pattern: '[0-9]*' }}
      label="Cruise speed"
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
