import { Box, Button, CircularProgress } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { lightSchema } from '../api/schema';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { HueLightEvent, paths } from '@smort-home/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { DateTime } from 'luxon';

export const Lights = () => {
  const result = useFirestoreCollection(paths.lights, lightSchema);

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
              onClick={async () => {
                const eventDoc = doc(
                  firestore,
                  paths.events(),
                  DateTime.now().toISOTime(),
                );
                const eventData: HueLightEvent = {
                  id: light.id,
                  state: {
                    on: {
                      on: !light.on,
                    },
                  },
                };
                await setDoc(eventDoc, {
                  type: 'hue.light',
                  handled: false,
                  data: eventData,
                });
              }}
            >
              {light.name}
            </Button>
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
