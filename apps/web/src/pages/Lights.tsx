import { Box, Card, CircularProgress, Stack, useTheme } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { useHueLights } from '../hooks/useHueLights';
import { LightCard } from '../components/molecules/LightCard';

export const Lights = () => {
  const result = useHueLights();

  if (result.isSuccess) {
    return (
      <Stack spacing={2}>
        {result.data.map(({ room, lights }) => (
          <Card key={room.id} sx={{}}>
            <Box>{room.name}</Box>
            <Grid container spacing={2}>
              {lights.map((light) => (
                <Grid xs={6} sm={4} key={light.id}>
                  <LightCard light={light} />
                </Grid>
              ))}
            </Grid>
          </Card>
        ))}
      </Stack>
    );
  } else if (result.isError) {
    return <Box>{result.error}</Box>;
  } else {
    return <CircularProgress />;
  }
};
