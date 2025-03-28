import {
  Box,
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
import { daysOfTheWeek, FsHueAlarm } from '@smort-home/firestore';
import { updateHueAlarm } from '../../events/hueAlarmEvents';
import { useState } from 'react';
import { MobileTimePicker } from '../molecules/MobileTimePicker';
import { AmPmChip } from '../atoms/AmPmChip';

interface AlarmCardProps {
  alarm: FsHueAlarm;
}

export const AlarmCard = ({ alarm }: AlarmCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography>Select time</Typography>
          <MobileTimePicker
            close={() => setShowEditModal(false)}
            trigger={alarm.trigger}
            onChange={(trigger) =>
              updateHueAlarm({
                id: alarm.id,
                state: { trigger },
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
              color={alarm.enabled ? 'primary' : 'neutral'}
              checked={alarm.enabled}
              sx={{
                [`& .${switchClasses.thumb}`]: {
                  transition: 'left 0.2s ease-in-out',
                },
                [`& .${switchClasses.track}`]: {
                  bgcolor: alarm.enabled ? undefined : 'neutral.400',
                },
              }}
              onChange={({ target: { checked: enabled } }) =>
                updateHueAlarm({
                  id: alarm.id,
                  state: {
                    enabled,
                  },
                })
              }
            />
          }
        >
          {alarm.name}
        </Typography>
        <Box display={'flex'} justifyContent={'center'}>
          <Sheet
            variant={'soft'}
            sx={{
              maxWidth: '300px',
              flex: 1,
              '& .MuiTypography-root': {
                color: alarm.enabled ? undefined : 'neutral.400',
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
                {`${alarm.trigger.time.hour.toString().padStart(2, '0')}:${alarm.trigger.time.minute.toString().padStart(2, '0')}`}
              </Typography>
              <Stack>
                <AmPmChip selected={alarm.trigger.time.amOrPm === 'am'}>
                  AM
                </AmPmChip>
                <AmPmChip selected={alarm.trigger.time.amOrPm === 'pm'}>
                  PM
                </AmPmChip>
              </Stack>
            </Stack>
            <Box p={1}>
              <Stack direction={'row'} gap={0.5} mt={-1}>
                {daysOfTheWeek.map((day) => (
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: `neutral.${alarm.trigger.recurrence.includes(day) ? 300 : 100}`,
                      color: `neutral.${alarm.trigger.recurrence.includes(day) ? 700 : 400}`,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {day.substring(0, 1).toUpperCase()}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Sheet>
        </Box>
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
