import { DateTime } from 'luxon';

const homeStateRoot = 'home-state';

export const paths = {
  lights: `${homeStateRoot}/hue/lights`,
  sonosDevices: `${homeStateRoot}/sonos/devices`,
  events: () => `events/${DateTime.now().toISODate()}/events`,
};
