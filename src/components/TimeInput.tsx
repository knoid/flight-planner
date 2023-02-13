import { ChangeEvent, useState } from 'react';
import PrintFriendlyInput from './PrintFriendlyInput';
import { useStore } from './store';

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
      const normalizedValue = formatTime(inputValue)
      setStartTime(normalizedValue);
      props.onChange(normalizedValue);
    }
  }

  return (
    <PrintFriendlyInput
      error={!!value && !validTime.test(value)}
      onBlur={onBlur}
      onChange={onChange}
      inputProps={{ size: 5 }}
      value={value}
    />
  );
}
