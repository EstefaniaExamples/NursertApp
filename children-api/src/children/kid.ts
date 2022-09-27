import { z } from "zod";

export const kidSchema = z.object({
  KidName: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).min(3,
    { message: "Must be 3 or more characters long" }),
  KidSurname: z.string(),
  BirthDate: z.string(),
  Address: z.string(),
});

// extract the inferred type
export type KidType = z.infer<typeof kidSchema>;