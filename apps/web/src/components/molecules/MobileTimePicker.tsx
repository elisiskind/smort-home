import { daysOfTheWeek, FsAlarmTrigger } from '@smort-home/firestore';
import Picker from 'react-mobile-picker';
import { useState } from 'react';
import { Box, Button, Checkbox, Stack } from '@mui/joy';

interface MobileTimePickerProps {
  trigger: FsAlarmTrigger;
  onChange: (trigger: FsAlarmTrigger) => void;
  close: () => void;
}

const hours = [...Array(12).keys()].map((key) => key + 1);
const minutes = [...Array(60).keys()];
const amOrPm = ['am', 'pm'] as const;

export const MobileTimePicker = ({
  trigger,
  onChange,
  close,
}: MobileTimePickerProps) => {
  const [time, setTime] = useState(trigger.time);
  const [recurrence, setRecurrence] = useState(trigger.recurrence);

  const changed =
    time.amOrPm !== trigger.time.amOrPm ||
    time.hour !== trigger.time.hour ||
    time.minute !== trigger.time.minute ||
    !recurrence.every((day) => trigger.recurrence.includes(day)) ||
    !trigger.recurrence.every((day) => recurrence.includes(day));
  return (
    <Box>
      <Stack direction={'row'} gap={3} alignItems={'center'} mb={2}>
        <Picker
          wheelMode={'normal'}
          style={{
            touchAction: 'none',
            flex: 1,
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
                {option.toUpperCase()}
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
        <Stack flex={1} gap={1}>
          {daysOfTheWeek.map((day) => {
            return (
              <Checkbox
                checked={recurrence.includes(day)}
                onChange={({ target: { checked } }) =>
                  setRecurrence(
                    checked
                      ? [...recurrence, day]
                      : recurrence.filter(
                          (recurrenceDay) => recurrenceDay !== day,
                        ),
                  )
                }
                label={day.substring(0, 1).toUpperCase() + day.substring(1)}
              />
            );
          })}
        </Stack>
      </Stack>
      <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
        <Button variant={'plain'} onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={!changed}
          onClick={() => {
            onChange({ time, recurrence });
            close();
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
};
