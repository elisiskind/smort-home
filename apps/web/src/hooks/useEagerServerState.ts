import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useEagerServerState = <T>(
  serverValue: T,
  onChange: (value: T) => void,
  debounce: number,
) => {
  const [value, setValueInternal] = useState(serverValue);
  const [debounced] = useDebounce(value, debounce);
  const [interacting, setInteracting] = useState(false);
  const [debouncedServerValue] = useDebounce(serverValue, debounce);

  useEffect(() => {
    if (interacting) {
      onChange(debounced);
    }
  }, [debounced, interacting]);

  useEffect(() => {
    setInteracting(false);
    setValueInternal(serverValue);
  }, [debouncedServerValue]);

  const setValue = (value: T) => {
    setInteracting(true);
    setValue(value);
  };

  return [value, setValue] as const;
};
