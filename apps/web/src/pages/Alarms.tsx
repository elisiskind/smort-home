import {
  Box,
  Card,
  CircularProgress,
  Switch,
  switchClasses,
  Typography,
} from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { updateHueAlarm, useHueAlarms } from '../events/hueAlarmEvents';
import { MobileTimePicker } from '../components/molecules/MobileTimePicker';

export const Alarms = () => {
  const hueAlarmsQuery = useHueAlarms();

  if (hueAlarmsQuery.isSuccess) {
    return (
      <Grid container spacing={2}>
        {hueAlarmsQuery.data.map((behavior) => (
          <Grid xs={12} sm={4} key={behavior.id}>
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
                    checked={behavior.enabled}
                    sx={{
                      [`& .${switchClasses.thumb}`]: {
                        transition: 'left 0.2s ease-in-out',
                      },
                    }}
                    onChange={({ target: { checked: enabled } }) =>
                      updateHueAlarm({
                        id: behavior.id,
                        state: {
                          enabled,
                        },
                      })
                    }
                  />
                }
              >
                {behavior.name}
              </Typography>
              <Box>
                <MobileTimePicker
                  time={behavior.when}
                  onChange={(when) =>
                    updateHueAlarm({
                      id: behavior.id,
                      state: { when },
                    })
                  }
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else if (hueAlarmsQuery.isError) {
    return <Box>{hueAlarmsQuery.error}</Box>;
  } else {
    return <CircularProgress />;
  }
};
