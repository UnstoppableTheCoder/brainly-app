import { z } from "zod";

const generateLinkSchema = z.object({
  share: z.boolean("Share value is required"),
});

export { generateLinkSchema };
