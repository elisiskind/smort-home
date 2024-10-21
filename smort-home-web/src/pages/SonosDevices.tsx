import { Box, Card, CircularProgress, Stack, Typography } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { sonosDeviceSchema } from '../api/schema';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { MusicNote } from '@mui/icons-material';
import { NowPlayingInfo } from '../components/molecules/NowPlayingInfo';
import { SonosDeviceCard } from '../components/organisms/SonosDeviceCard';

export const SonosDevices = () => {
  const collection = useFirestoreCollection(
    'home-state/sonos/devices',
    sonosDeviceSchema,
  );

  if (collection.isSuccess) {
    console.log(collection.data);
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
