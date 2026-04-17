import { Types } from "mongoose";
import { z } from "zod";

export const objectIdStringSchema = z
  .string()
  .trim()
  .refine((value) => Types.ObjectId.isValid(value), "Invalid MongoDB ObjectId.");

export function isObjectIdString(value: string): boolean {
  return Types.ObjectId.isValid(value);
}
