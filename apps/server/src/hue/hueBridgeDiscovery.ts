import { z } from 'zod';

const hueBridgeMetadata = z
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

export type HueBridgeMetadata = z.infer<typeof hueBridgeMetadata>;

export const discoverBridge = async () => {
  const response = await fetch('https://discovery.meethue.com', {
    method: 'GET',
  });
  return hueBridgeMetadata.parse(await response.json());
};
