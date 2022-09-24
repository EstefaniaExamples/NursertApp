// No underscores in filenames please

import { z } from "zod";

export const kidSchema = z.object({
  KidName: z.string({
    // Not entirely sure of the benefit of the custom error messages
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).min(3,
    // I also think this would be quite similar to the default :D
    { message: "Must be 3 or more characters long" }),
  KidSurname: z.string(),
  BirthDate: z.string(),
  Address: z.string(),
});

// extract the inferred type
export type KidType = z.infer<typeof kidSchema>;
