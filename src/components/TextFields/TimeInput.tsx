import { styled } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useStore } from '../store';
import PrintFriendlyInput from './PrintFriendlyInput';

interface TimeInputProps {
  onChange?: (value: string) => void;
}

export const validTime = /^[0-9]{1,2}:[0-9]{1,2}$/;
function formatTime(value: string) {
  return value
    .split(':')
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
  const [value, setValue] = useState(startTime);

  function onBlur() {
    if (validTime.test(value)) {
      setValue(formatTime(value));
    }
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value;
    setValue(inputValue);
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
      value={value}
    />
  );
}
