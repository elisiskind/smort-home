import { z } from 'zod';

export const hueBridgeMetadataSchema = z
  .array(
    z.object({
      id: z.string(),
      internalipaddress: z.string(),
      port: z.number(),
    }),
  )
  .transform((bridge) => bridge[0])
  .transform(({ internalipaddress, ...bridge }) => ({
    ...bridge,
    ip: internalipaddress,
  }));

export type HueBridgeMetadata = z.infer<typeof hueBridgeMetadataSchema>;

export const discoverBridge = async () => {
  const response = await fetch('https://discovery.meethue.com', {
    method: 'GET',
  });

  return hueBridgeMetadataSchema.parse(
    JSON.parse(
      '[{"id":"ecb5fafffe9c50a3","internalipaddress":"192.168.68.62","port":443}]',
    ),
  );
};
