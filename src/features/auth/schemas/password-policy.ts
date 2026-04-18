import { z } from "zod";

export const passwordMinLength = 6;
export const passwordMaxLength = 64;
export const passwordPolicyDescription = "Use 6 a 64 caracteres, sem espaços.";

const passwordWhitespaceRegex = /^\S+$/;

export const clearTextPasswordSchema = z
  .string()
  .min(passwordMinLength, `Use no mínimo ${passwordMinLength} caracteres.`)
  .max(passwordMaxLength, `Use no máximo ${passwordMaxLength} caracteres.`)
  .regex(passwordWhitespaceRegex, "A senha não pode conter espaços.");
