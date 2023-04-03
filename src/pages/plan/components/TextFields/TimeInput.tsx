import { styled } from '@mui/material';
import { ChangeEvent, FocusEvent, useState } from 'react';

import { useStore } from '../../../../components/store';
import PrintFriendlyInput from './PrintFriendlyInput';

const validTime = /^[0-9]{1,2}(:[0-9]{1,2})?$/;
function formatTime(value: string) {
  return value
    .split(':')
    .concat(['0'])
    .slice(0, 2)
    .map((num) => num.padStart(2, '0'))
    .join(':');
}

const CenteredInput = styled(PrintFriendlyInput)({
  input: {
    textAlign: 'center',
  },
});

export default function TimeInput() {
  const { startTime, setStartTime } = useStore();
  const [rawValue, setRawValue] = useState(startTime);
  const value = rawValue.trim();

  function onBlur() {
    if (validTime.test(value)) {
      setRawValue(formatTime(value));
    }
  }

  function onFocus(event: FocusEvent<HTMLInputElement>) {
    event.currentTarget.select();
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    let inputValue = event.currentTarget.value;
    const startsWithHours = /^(\d{2}):?/;
    if (inputValue.length > rawValue.length && inputValue.match(startsWithHours)) {
      inputValue = inputValue.replace(startsWithHours, '$1:');
    }
    setRawValue(inputValue);
    setStartTime(validTime.test(inputValue) ? formatTime(inputValue) : '');
  }

  return (
    <CenteredInput
      error={!!value && !validTime.test(value)}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      inputProps={{ size: 5 }}
      value={rawValue}
    />
  );
}
