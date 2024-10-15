import {z} from 'zod';

export const lightsSchema = z
    .object({
        data: z.array(
            z
                .object({
                    id: z.string(),
                    metadata: z.object({
                        name: z.string(),
                        archetype: z.string(),
                    }),
                    on: z.object({
                        on: z.boolean(),
                    }),
                })
                .transform((light) => ({
                    id: light.id,
                    name: light.metadata.name,
                    on: light.on.on,
                })),
        ),
    })
    .transform(({data}) => data);