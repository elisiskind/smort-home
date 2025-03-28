import { z } from 'zod';

const colorTemperatureBaseSchema = z.object({
  mirek: z.number().nullable(),
  mirek_valid: z.boolean().optional(),
  mirek_schema: z.object({
    mirek_minimum: z.number(),
    mirek_maximum: z.number(),
  }),
});

const colorTemperatureSchema = colorTemperatureBaseSchema
  .optional()
  .transform((ct) =>
    ct
      ? ({
          value: ct.mirek,
          valid: ct.mirek_valid,
          schema: {
            min: ct.mirek_schema.mirek_minimum,
            max: ct.mirek_schema.mirek_maximum,
          } as const,
        } as const)
      : null,
  )
  .readonly();

const dimmingSchema = z
  .object({
    brightness: z.number(),
    min_dim_level: z.number().optional(),
  })
  .optional()
  .transform((dimming) =>
    dimming
      ? ({
          brightness: dimming.brightness,
          minDimLevel: dimming.min_dim_level ?? null,
        } as const)
      : null,
  )
  .readonly();

const onSchema = z
  .object({
    on: z.boolean(),
  })
  .transform(({ on }) => on);

const lightSchema = z
  .object({
    type: z.literal('light'),
    id: z.string(),
    owner: z.object({
      rid: z.string(),
    }),
    metadata: z.object({
      name: z.string(),
    }),
    on: onSchema,
    dimming: dimmingSchema,
    color_temperature: colorTemperatureSchema,
  })
  .transform(
    ({ metadata, color_temperature, owner, ...light }) =>
      ({
        colorTemperature: color_temperature,
        name: metadata.name,
        rid: owner.rid,
        ...light,
      }) as const,
  )
  .readonly();

export const hueLightUpdateSchema = z
  .object({
    id: z.string(),
    on: onSchema.optional(),
    dimming: dimmingSchema,
    color_temperature: colorTemperatureBaseSchema
      .pick({ mirek: true, mirek_valid: true })
      .optional(),
  })
  .transform((update): HueLightUpdateEvent => {
    return {
      id: update.id,
      on: update.on ?? null,
      dimming: update.dimming ?? null,
      colorTemperature: update.color_temperature
        ? {
            value: update.color_temperature.mirek,
            valid: update.color_temperature.mirek_valid ?? null,
          }
        : null,
    } as const;
  })
  .readonly();

export type HueLightUpdateEvent = {
  id: string;
  on: boolean | null;
  dimming: { brightness: number } | null;
  colorTemperature: {
    value: number | null;
    valid: boolean | null;
  } | null;
};

export type HueLightUpdate = z.input<typeof hueLightUpdateSchema>;

export const lightsSchema = z
  .object({
    data: z.array(lightSchema),
  })
  .transform(({ data }) => data);
