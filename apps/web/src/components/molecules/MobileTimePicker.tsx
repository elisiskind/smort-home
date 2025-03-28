import { When } from '@smort-home/firestore';
import Picker from 'react-mobile-picker';
import { useState } from 'react';
import { Box, Button, Stack } from '@mui/joy';

interface MobileTimePickerProps {
  time: When;
  onChange: (when: When) => void;
  close: () => void;
}

const hours = [...Array(12).keys()].map((key) => key + 1);
const minutes = [...Array(60).keys()];
const amOrPm = ['AM', 'PM'] as const;

export const MobileTimePicker = ({
  time: initialTime,
  onChange,
  close,
}: MobileTimePickerProps) => {
  const [time, setTime] = useState(initialTime);

  const changed =
    time.amOrPm !== initialTime.amOrPm ||
    time.hour !== initialTime.hour ||
    time.minute !== initialTime.minute;

  return (
    <Box>
      <Picker
        wheelMode={'normal'}
        style={{
          touchAction: 'none',
        }}
        value={time}
        onChange={setTime}
      >
        <Picker.Column name={'hour'}>
          {hours.map((option) => (
            <Picker.Item key={option} value={option}>
              {`${option}`.padStart(2, '0')}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name={'minute'}>
          {minutes.map((option) => (
            <Picker.Item key={option} value={option}>
              {`${option}`.padStart(2, '0')}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name={'amOrPm'}>
          {amOrPm.map((option) => (
            <Picker.Item key={option} value={option}>
              {option}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
      <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
        <Button variant={'plain'} onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={!changed}
          onClick={() => {
            onChange(time);
            close();
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
};
