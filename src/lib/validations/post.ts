import { z, ZodObject } from "zod";

/**
 * Validates a single field dynamically based on a Zod object schema.
 *
 * @param schema - The Zod object schema for the form step.
 * @param fieldName - The name of the field to validate.
 * @param value - The value of the field to validate.
 * @returns An error message if the field is invalid, or undefined if valid.
 */
export function validateField<T extends ZodObject<any>>(
  schema: T,
  fieldName: keyof z.infer<T>,
  value: any
): string | undefined {
  try {
    z.object({ [fieldName]: schema.shape[fieldName] }).parse({ [fieldName]: value });
    return undefined; 
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid value"; 
    }
    return "Invalid value"; 
  }
}