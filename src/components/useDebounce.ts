import { useEffect } from 'react';
import { useDebounceValue } from 'usehooks-ts';

export default function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useDebounceValue(value, delay);

  useEffect(() => setDebouncedValue(value), [value]);

  return debouncedValue;
}
