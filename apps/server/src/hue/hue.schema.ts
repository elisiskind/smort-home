import {
  colorTemperatureSchema,
  dimmingSchema,
  onSchema,
} from '@smort-home/firestore';
import { z } from 'zod';

export const lightInputSchema = z.object({
  type: z.literal('light'),
  id: z.string(),
  owner: z.object({
    rid: z.string(),
  }),
  metadata: z.object({
    name: z.string(),
  }),
  on: onSchema.transform(({ on }) => on),
  dimming: dimmingSchema.optional().transform((dimming) =>
    dimming
      ? {
          brightness: dimming.brightness,
          minDimLevel: dimming.min_dim_level ?? null,
        }
      : null,
  ),
  color_temperature: colorTemperatureSchema
    .optional()
    .transform((ct) =>
      ct
        ? {
            value: ct.mirek,
            valid: ct.mirek_valid,
            schema: {
              min: ct.mirek_schema.mirek_minimum,
              max: ct.mirek_schema.mirek_maximum,
            },
          }
        : null,
    )
    .readonly(),
});

const lightSchema = lightInputSchema
  .transform(({ metadata, color_temperature, owner, ...light }) => ({
    colorTemperature: color_temperature,
    name: metadata.name,
    rid: owner.rid,
    ...light,
  }))
  .readonly();

export const lightUpdateSchema = lightInputSchema
  .partial()
  .extend({
    id: z.string(),
  })
  .transform(({ metadata, color_temperature, ...light }) => ({
    ...light,
    colorTemperature: color_temperature ?? null,
    id: light.id as string,
  }));

export const lightsSchema = z
  .object({
    data: z.array(lightSchema),
  })
  .transform(({ data }) => data);

export type Light = z.infer<typeof lightSchema>;
export type LightUpdate = z.infer<typeof lightUpdateSchema>;

export const roomSchema = z
  .object({
    id: z.string(),
    children: z.array(
      z.object({
        rid: z.string(),
      }),
    ),
    metadata: z.object({
      name: z.string(),
      type: z.literal('room').optional(),
    }),
  })
  .transform((room) => ({
    id: room.id,
    lights: room.children.map(({ rid }) => rid),
    name: room.metadata.name,
  }));

export type Room = z.infer<typeof roomSchema>;

export const roomsSchema = z
  .object({
    data: z.array(roomSchema),
  })
  .transform(({ data }) => data);
