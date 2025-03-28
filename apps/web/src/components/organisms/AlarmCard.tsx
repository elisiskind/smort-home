import {
  Button,
  Card,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Switch,
  switchClasses,
  Typography,
} from '@mui/joy';
import { HueAlarm } from '@smort-home/firestore';
import { updateHueAlarm } from '../../events/hueAlarmEvents';
import { useState } from 'react';
import { MobileTimePicker } from '../molecules/MobileTimePicker';
import { AmPmChip } from '../atoms/AmPmChip';

interface AlarmCardProps {
  alarm: HueAlarm;
}

export const AlarmCard = ({ alarm }: AlarmCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography>Select time</Typography>
          <MobileTimePicker
            close={() => setShowEditModal(false)}
            time={alarm.when}
            onChange={(when) =>
              updateHueAlarm({
                id: alarm.id,
                state: {
                  when,
                },
              })
            }
          />
        </ModalDialog>
      </Modal>
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
              variant={'solid'}
              color={'neutral'}
              // checked={alarm.enabled}
              checked={enabled}
              sx={{
                [`& .${switchClasses.thumb}`]: {
                  transition: 'left 0.2s ease-in-out',
                },
                [`& .${switchClasses.track}`]: {
                  background: enabled ? 'neutral.800' : 'neutral.200',
                },
              }}
              onChange={
                ({ target: { checked: enabled } }) => setEnabled(enabled)
                // updateHueAlarm({
                //   id: alarm.id,
                //   state: {
                //     enabled,
                //   },
                // })
              }
            />
          }
        >
          {alarm.name}
        </Typography>
        <Sheet
          variant={'soft'}
          sx={{
            '& *': {
              color: enabled ? 'neutral.800' : 'neutral.300',
              transition: 'color 0.1s ease-in-out',
            },
          }}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-evenly'}
          >
            <Typography sx={{ fontFamily: 'share tech mono', fontSize: 48 }}>
              {`${alarm.when.hour.toString().padStart(2, '0')}:${alarm.when.minute.toString().padStart(2, '0')}`}
            </Typography>
            <Stack>
              <AmPmChip selected={alarm.when.amOrPm === 'AM'}>AM</AmPmChip>
              <AmPmChip selected={alarm.when.amOrPm === 'PM'}>PM</AmPmChip>
            </Stack>
          </Stack>
        </Sheet>
        <Button
          variant={'soft'}
          color={'neutral'}
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </Button>
      </Card>
    </>
  );
};
