import { z } from 'zod';

const behaviorSchema = z
  .object({
    id: z.string(),
    metadata: z.object({
      name: z.string(),
    }),
    configuration: z.any(),
    enabled: z.boolean(),
  })
  .transform(({ metadata, ...behavior }) => ({
    ...behavior,
    name: metadata.name,
  }));

export const behaviorsSchema = z
  .object({
    data: z.array(behaviorSchema),
  })
  .transform(({ data }) =>
    data.filter((entry) => Object.keys(entry.configuration)),
  );
