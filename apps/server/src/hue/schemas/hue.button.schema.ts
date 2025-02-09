import { z } from 'zod';

export const hueButtonEventSchema = z
  .object({
    id: z.string(),
    button: z.object({
      button_report: z.object({
        event: z.string(),
      }),
    }),
  })
  .transform(({ id, button }) => ({
    id,
    buttonEvent: button.button_report.event,
  }))
  .readonly();

export type HueButtonEvent = z.infer<typeof hueButtonEventSchema>;
