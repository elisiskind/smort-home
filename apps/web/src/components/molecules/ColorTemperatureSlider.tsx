import { DebouncedSlider } from '../atoms/DebouncedSlider';
import { updateHueLight } from '../../events/hueLightEvents';
import { useTheme } from '@mui/joy';
import {
  convertMirekValueToPercentage,
  getRgbValueFromPercentageFactor,
  gradientBg,
  convertPercentageToMirekValue,
  ValidColorTemperature,
} from '../atoms/colorTemperatureUtils';

interface ColorTemperatureSliderProps {
  colorTemperature: ValidColorTemperature;
  id: string;
}

export const ColorTemperatureSlider = ({
  colorTemperature,
  id,
}: ColorTemperatureSliderProps) => {
  const theme = useTheme();

  const adjustedValue = convertMirekValueToPercentage(colorTemperature);

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
          background: `rgb(${getRgbValueFromPercentageFactor(adjustedValue).join(', ')})`,
          transition: 'background 0.2s ease-in-out',
        },
      }}
      serverValue={adjustedValue}
      onChange={(newValue) =>
        updateHueLight({
          id,
          state: {
            colorTemperature: {
              value: convertPercentageToMirekValue(
                newValue,
                colorTemperature.schema,
              ),
            },
          },
        })
      }
    />
  );
};
