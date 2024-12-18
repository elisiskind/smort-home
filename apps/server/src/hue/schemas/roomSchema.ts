import { z } from 'zod';

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

export const groupSchema = z.object({
  id: z.string(),
  owner: z.object({
    rid: z.string(),
    rtype: z.string(),
  }),
  on: z
    .object({
      on: z.boolean(),
    })
    .transform(({ on }) => on),
  dimming: z
    .object({
      brightness: z.number(),
    })
    .transform(({ brightness }) => brightness)
    .optional()
    .transform((brightness) => brightness ?? null),
});

export const groupsSchema = z
  .object({
    data: z.array(groupSchema),
  })
  .transform(({ data }) => data)
  .transform((data) =>
    data
      .filter(({ owner }) => (owner.rtype = 'room'))
      .map(({ owner, ...group }) => ({
        ...group,
        owner: owner.rid,
      })),
  );
