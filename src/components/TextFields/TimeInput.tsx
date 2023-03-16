import { styled } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useStore } from '../store';
import PrintFriendlyInput from './PrintFriendlyInput';

interface TimeInputProps {
  onChange?: (value: string) => void;
}

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

export default function TimeInput(props: TimeInputProps) {
  const { startTime, setStartTime } = useStore();
  const [rawValue, setRawValue] = useState(startTime);
  const value = rawValue.trim();

  function onBlur() {
    if (validTime.test(value)) {
      setRawValue(formatTime(value));
    }
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value;
    setRawValue(inputValue);
    if (validTime.test(inputValue)) {
      const normalizedValue = formatTime(inputValue);
      setStartTime(normalizedValue);
      props.onChange?.(normalizedValue);
    }
  }

  return (
    <CenteredInput
      error={!!value && !validTime.test(value)}
      onBlur={onBlur}
      onChange={onChange}
      inputProps={{ size: 5 }}
      value={rawValue}
    />
  );
}
