import { LightUpdate } from '@smort-home/firestore';
import { HueLightUpdate } from './lightSchema';

export const transformLightUpdate = (
  id: string,
  update: LightUpdate,
): HueLightUpdate => ({
  id,
  on: update.on !== undefined ? { on: update.on } : undefined,
  dimming: update.dimming ?? undefined,
  color_temperature: update.colorTemperature
    ? { mirek: update.colorTemperature.value }
    : undefined,
});
