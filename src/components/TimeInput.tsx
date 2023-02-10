import { ChangeEvent, useState } from 'react';
import PrintFriendlyInput from './PrintFriendlyInput';

interface TimeInputProps {
  onChange: (value: string) => void;
}

export const validTime = /^[0-9]{1,2}:[0-9]{1,2}$/;
function formatTime(value: string) {
  return value
    .split(':')
    .map((num) => num.padStart(2, '0'))
    .join(':');
}

export default function TimeInput(props: TimeInputProps) {
  const [value, setValue] = useState('');

  function onBlur() {
    if (validTime.test(value)) {
      setValue(formatTime(value));
    }
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value;
    setValue(inputValue);
    if (validTime.test(inputValue)) {
      props.onChange(formatTime(inputValue));
    }
  }

  return (
    <PrintFriendlyInput
      error={!validTime.test(value)}
      onBlur={onBlur}
      onChange={onChange}
      inputProps={{ size: 5 }}
      value={value}
    />
  );
}
