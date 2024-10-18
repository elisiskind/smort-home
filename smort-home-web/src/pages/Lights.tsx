import { useUpdateLightMutation } from '../api/api';
import { Box, Button, CircularProgress } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { useCollection } from 'react-firebase-hooks/firestore';
import { lightsSchema } from '../api/schema';
import { firestore } from '../firebase';
import { collection } from 'firebase/firestore';

export const Lights = () => {
  const [updateLight] = useUpdateLightMutation();
  const [lightsResult, loading, error] = useCollection(
    collection(firestore, 'home-state/hue/lights'),
  );

  if (lightsResult) {
    const lights = lightsSchema.parse(
      lightsResult.docs.map((light) => light.data()),
    );
    return (
      <Grid container spacing={2}>
        {lights.map((light) => (
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
  } else if (error) {
    return <Box>{error.message}</Box>;
  } else {
    return <CircularProgress />;
  }
};
