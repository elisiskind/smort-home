import { z } from 'zod';

export const lightInputSchema = z.object({
  type: z.literal('light'),
  id: z.string(),
  metadata: z.object({
    name: z.string(),
  }),
  on: z.object({ on: z.boolean() }).transform(({ on }) => on),
  dimming: z
    .object({
      brightness: z.number(),
      min_dim_level: z.number().optional().default(null),
    })
    .optional()
    .transform((dimming) =>
      dimming
        ? {
            brightness: dimming.brightness,
            minDimLevel: dimming.min_dim_level,
          }
        : null,
    ),
  color_temperature: z
    .object({
      mirek: z.number(),
      mirek_valid: z.boolean(),
      mirek_schema: z.object({
        mirek_minimum: z.number(),
        mirek_maximum: z.number(),
      }),
    })
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
  .transform(({ metadata, color_temperature, ...light }) => ({
    colorTemperature: color_temperature,
    name: metadata.name,
    ...light,
  }))
  .readonly();

const lightUpdateSchema = lightInputSchema
  .partial()
  .extend({
    id: z.string(),
  })
  .transform(({ metadata, color_temperature, ...light }) => ({
    ...light,
    colorTemperature: color_temperature,
    name: metadata?.name,
    id: light.id as string,
  }));

export const lightsSchema = z
  .object({
    data: z.array(lightSchema),
  })
  .transform(({ data }) => data);

export type Light = z.infer<typeof lightSchema>;
export type LightUpdate = z.infer<typeof lightUpdateSchema>;