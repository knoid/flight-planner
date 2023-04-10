import { InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';

import { useStore } from '../../../../components/store';
import { useI18nContext } from '../../../../i18n/i18n-react';
import NumericTextField from './NumericTextField';

const inputProps = { pattern: '[0-9]*' };
const InputProps = { endAdornment: <InputAdornment position="end">kt</InputAdornment> };

export default function CruiseSpeedInput() {
  const { LL } = useI18nContext();
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
      label={LL.cruiseSpeed()}
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
