import {z} from "zod";

export const lightSchema = z.object({
    id: z.string(),
    name: z.string(),
    on: z.boolean(),
})

export const lightsSchema = z.array(lightSchema);

export type Light = z.infer<typeof lightSchema>;