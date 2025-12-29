import { z } from "zod";

const addContentSchema = z.object({
  title: z
    .string("title is required")
    .max(50, "Title is too long")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Title cannot be empty" }),
  link: z
    .string("link is required")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Link cannot be empty" }),
  linkType: z
    .string("Link type is required")
    .max(25, "Link type is too long")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Link type cannot be empty"),
  tags: z.array(z.string()).min(1),
});

const updateContentSchema = z.object({
  title: z
    .string("title is required")
    .max(50, "Title is too long")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Title cannot be empty" }),
  link: z
    .string("link is required")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Link cannot be empty" }),
  linkType: z
    .string("Link type is required")
    .max(25, "Link type is too long")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Link type cannot be empty"),
  tags: z.array(z.string()).min(1),
});

export { addContentSchema, updateContentSchema };
