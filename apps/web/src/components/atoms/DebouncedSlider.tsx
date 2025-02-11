import { Slider } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { useEagerServerState } from '../../hooks/useEagerServerState';

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
  const [value, setValue] = useEagerServerState(serverValue, onChange, 500);

  return (
    <Slider
      value={value}
      onChange={(_, value) => {
        setValue(typeof value === 'number' ? value : value[0]);
      }}
      sx={sx}
      max={100}
    />
  );
};
