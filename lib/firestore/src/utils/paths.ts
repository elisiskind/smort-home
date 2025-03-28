import { DateTime } from 'luxon';

const homeStateRoot = 'home-state';

export const paths = {
  hue: {
    lights: `${homeStateRoot}/hue/lights`,
    alarms: `${homeStateRoot}/hue/alarms`,
    rooms: `${homeStateRoot}/hue/rooms`,
  },
  sonos: {
    devices: `${homeStateRoot}/sonos/devices`,
    alarms: `${homeStateRoot}/sonos/alarms`,
  },
  alarms: `${homeStateRoot}/app/alarms`,
  events: () => `events/${DateTime.now().toISODate()}/events`,
};
