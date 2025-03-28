import {
  convertMirekValueToPercentage,
  getRgbValueFromPercentageFactor,
  formatAsRgba,
  isValidColorTemperature,
} from '../atoms/colorTemperatureUtils';
import {
  Box,
  sliderClasses,
  Stack,
  Switch,
  switchClasses,
  Typography,
  useTheme,
} from '@mui/joy';
import { updateHueLight } from '../../events/hueLightEvents';
import { DebouncedSlider } from '../atoms/DebouncedSlider';
import { ColorTemperatureSlider } from './ColorTemperatureSlider';
import { fsHueLight } from '@smort-home/firestore';

interface LightCardProps {
  light: fsHueLight;
}

const defaultColor = [255, 254, 218] as const;

export const LightCard = ({ light }: LightCardProps) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        height: '100%',
        display: 'flex',
        padding: 2,
        borderRadius: 8,
        justifyContent: 'flex-start',
        background: theme.palette.neutral.solidBg,
      }}
      spacing={2}
    >
      <Box>
        <Typography
          component="label"
          sx={{
            cursor: 'pointer',
            flex: 1,
            justifyContent: 'space-between',
            color: theme.palette.neutral.plainActiveBg,
          }}
          endDecorator={
            <Switch
              checked={light.on}
              sx={{
                [`& .${switchClasses.thumb}`]: {
                  transition: 'left 0.2s ease-in-out',
                },
                [`& .${switchClasses.track}`]: {
                  backgroundColor: light.on
                    ? formatAsRgba(defaultColor)
                    : theme.palette.neutral.mainChannel,
                  transition: 'background 0.3s ease-in-out',
                },
              }}
              onChange={({ target: { checked: on } }) =>
                updateHueLight({
                  id: light.id,
                  state: { on },
                })
              }
            />
          }
        >
          {light.name}
        </Typography>
      </Box>
      <Stack
        sx={{
          transition: 'background-color 0.3s ease-in-out',
          backgroundColor: formatAsRgba(
            isValidColorTemperature(light.colorTemperature)
              ? getRgbValueFromPercentageFactor(
                  convertMirekValueToPercentage(light.colorTemperature),
                )
              : defaultColor,
            light.on ? (light.dimming ? light.dimming.brightness / 100 : 1) : 0,
          ),
          borderRadius: 8,
        }}
        paddingInline={2}
      >
        {light.dimming && (
          <DebouncedSlider
            sx={{
              [`& .${sliderClasses.rail}`]: theme.palette.neutral.solidBg,
            }}
            serverValue={light.dimming.brightness}
            onChange={(brightness) =>
              updateHueLight({
                id: light.id,
                state: { dimming: { brightness } },
              })
            }
          />
        )}
        {isValidColorTemperature(light.colorTemperature) && (
          <ColorTemperatureSlider
            colorTemperature={light.colorTemperature}
            id={light.id}
          />
        )}
      </Stack>
    </Stack>
  );
};
