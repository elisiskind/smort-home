import { Box, CircularProgress } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { useHueAlarms } from '../events/hueAlarmEvents';
import { AlarmCard } from '../components/organisms/AlarmCard';

export const Alarms = () => {
  const hueAlarmsQuery = useHueAlarms();

  if (hueAlarmsQuery.isSuccess) {
    return (
      <Grid container spacing={2}>
        {hueAlarmsQuery.data.map((behavior) => (
          <Grid xs={12} sm={4} key={behavior.id}>
            <AlarmCard alarm={behavior} />
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
