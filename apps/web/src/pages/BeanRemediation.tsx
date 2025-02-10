import { Box, Button } from '@mui/joy';
import * as events from 'events';
import { LightEvent, paths } from '@smort-home/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { DateTime } from 'luxon';

const sendSprayEvent = async () => {
  const eventDoc = doc(firestore, paths.events(), DateTime.now().toISOTime());
  await setDoc(eventDoc, {
    type: 'antibean.spray',
    handled: false,
    data: 0,
  });
};

export const BeanRemediation = () => {
  return (
    <Box>
      <Button onClick={sendSprayEvent}>Spray the man</Button>
    </Box>
  );
};
