import {
  Box,
  Card,
  CircularProgress,
  Switch,
  switchClasses,
  Typography,
} from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { useHueBehaviors } from '../hooks/useHueLights';

export const Automations = () => {
  const { updateBehavior, result } = useHueBehaviors();

  if (result.isSuccess) {
    return (
      <Grid container spacing={2}>
        {result.data.map((behavior) => (
          <Grid xs={6} sm={4} key={behavior.id}>
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
                      updateBehavior({
                        id: behavior.id,
                        state: { enabled },
                      })
                    }
                  />
                }
              >
                {behavior.name}
              </Typography>
              <code>{JSON.stringify(behavior.configuration, null, 2)}</code>
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
