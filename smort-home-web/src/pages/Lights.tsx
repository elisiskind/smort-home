import { useGetLightsQuery, useUpdateLightMutation } from '../api/api';
import { Box, Button, CircularProgress } from '@mui/joy';
import Grid from '@mui/joy/Grid';

export const Lights = () => {
  const result = useGetLightsQuery();
  const [updateLight] = useUpdateLightMutation();

  if (result.isSuccess) {
    return (
      <Grid container spacing={2}>
        {result.data.map((light) => (
          <Grid xs={6} sm={4} key={light.id}>
            <Button
              fullWidth
              sx={{ flex: 1 }}
              color={!light.on ? 'neutral' : 'primary'}
              variant={light.on ? 'solid' : 'soft'}
              onClick={() => updateLight({ id: light.id, on: !light.on })}
            >
              {light.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  } else if (result.isError) {
    return <Box>{JSON.stringify(result.error)}</Box>;
  } else {
    return <CircularProgress />;
  }
};
