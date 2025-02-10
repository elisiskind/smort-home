import { DebouncedSlider } from '../atoms/DebouncedSlider';
import { updateHueLight } from '../../events/hueLightEvents';
import { ColorTemperature } from '@smort-home/firestore';
import { useTheme } from '@mui/joy';
import {
  adjustValue,
  calculateColor,
  gradientBg,
  reverseAdjustValue,
} from '../atoms/colorTemperatureUtils';

interface ColorTemperatureSliderProps {
  colorTemperature: ColorTemperature;
  id: string;
}

export const ColorTemperatureSlider = ({
  colorTemperature,
  id,
}: ColorTemperatureSliderProps) => {
  const theme = useTheme();

  const adjustedValue = adjustValue(colorTemperature);

  return (
    <DebouncedSlider
      sx={{
        '.MuiSlider-rail': {
          background: gradientBg,
          border: `1px solid ${theme.colorSchemes.light.palette.neutral.outlinedBorder}`,
        },
        '.MuiSlider-track': {
          visibility: 'hidden',
        },
        '.MuiSlider-thumb': {
          background: `rgb(${calculateColor(adjustedValue).join(', ')})`,
          transition: 'background 0.2s ease-in-out',
        },
      }}
      serverValue={adjustedValue}
      onChange={(newValue) =>
        updateHueLight({
          id,
          state: {
            colorTemperature: {
              value: reverseAdjustValue(newValue, colorTemperature.schema),
            },
          },
        })
      }
    />
  );
};
