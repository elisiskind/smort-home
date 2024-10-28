import {
  Box,
  Card,
  CircularProgress,
  Switch,
  switchClasses,
  Typography,
} from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { useHueLights } from '../hooks/useHueLights';
import { DebouncedSlider } from '../components/atoms/DebouncedSlider';

export const Lights = () => {
  const { updateLight, result } = useHueLights();

  if (result.isSuccess) {
    return (
      <Grid container spacing={2}>
        {result.data.map((light) => (
          <Grid xs={6} sm={4} key={light.id}>
            <Card>
              <Typography
                component="label"
                sx={{
                  cursor: 'pointer',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
                endDecorator={
                  <Switch
                    checked={light.on}
                    sx={{
                      [`& .${switchClasses.thumb}`]: {
                        transition: 'left 0.2s ease-in-out',
                      },
                    }}
                    onChange={(event) =>
                      updateLight({
                        id: light.id,
                        state: {
                          on: {
                            on: event.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
              >
                {light.name}
              </Typography>
              {light.dimming && (
                <DebouncedSlider
                  serverValue={light.dimming.brightness}
                  onChange={(value) =>
                    updateLight({
                      id: light.id,
                      state: {
                        dimming: { brightness: value },
                      },
                    })
                  }
                />
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else if (result.isError) {
    return <Box>{result.error}</Box>;
  } else {
    return <CircularProgress />;
  }
};
