import { z } from "zod";
import { createBookSchema } from "./create-book.schema";

export const updateBookSchema = createBookSchema.partial().extend({
  id: z.number().int().positive()
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;