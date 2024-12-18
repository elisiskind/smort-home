import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Slider } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

interface DebouncedSliderProps {
  serverValue: number;
  onChange: (value: number) => void;
  sx?: SxProps;
}

export const DebouncedSlider = ({
  serverValue,
  onChange,
  sx,
}: DebouncedSliderProps) => {
  const [value, setValue] = useState(serverValue);
  const [debounced] = useDebounce(value, 500);
  const [interacting, setInteracting] = useState(false);
  const [debouncedServerValue] = useDebounce(serverValue, 500);

  useEffect(() => {
    if (interacting) {
      onChange(debounced);
    }
  }, [debounced, interacting]);

  useEffect(() => {
    setInteracting(false);
    setValue(serverValue);
  }, [debouncedServerValue]);

  return (
    <Slider
      value={value}
      onChange={(_, value) => {
        setInteracting(true);
        setValue(typeof value === 'number' ? value : value[0]);
      }}
      sx={sx}
      max={100}
    />
  );
};
