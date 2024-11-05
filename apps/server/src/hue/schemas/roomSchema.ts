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
