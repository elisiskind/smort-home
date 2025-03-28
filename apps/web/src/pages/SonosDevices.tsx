import { Box, CircularProgress } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { fsSonosDeviceSchema } from '../../../../lib/firestore/src/schemas/sonos.schema';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { SonosDeviceCard } from '../components/organisms/SonosDeviceCard';
import { paths } from '@smort-home/firestore';

export const SonosDevices = () => {
  const collection = useFirestoreCollection(
    paths.sonos.devices,
    fsSonosDeviceSchema,
  );

  if (collection.isSuccess) {
    return (
      <Grid container spacing={2}>
        {collection.data.map((device) => (
          <Grid xs={6} sm={4} key={device.id}>
            <SonosDeviceCard device={device} />
          </Grid>
        ))}
      </Grid>
    );
  } else if (collection.isError) {
    return <Box>{collection.error}</Box>;
  } else {
    return <CircularProgress />;
  }
};
