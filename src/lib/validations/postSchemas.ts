import { z } from "zod";

export const step1Schema = z.object({
  petName: z.string().optional(),
  species: z.enum(["DOG", "CAT", "OTHER"], { required_error: "Species is required" }),
  breed: z.string().optional(),
  color: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"], { required_error: "Gender is required" }),
  ageApprox: z.string().optional(),
});

export const step2Schema = z.object({
  date: z.date().nullable(),
  description: z.string().min(1, "Description is required"),
});

export const step3Schema = z.object({
  imageUrl: z.string().url({ message: "Image URL must be valid" }),
});

export const step4Schema = z.object({
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export const combinedSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);