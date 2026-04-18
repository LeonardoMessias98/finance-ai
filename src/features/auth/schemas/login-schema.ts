import { z } from "zod";

const passwordHashRegex = /^[a-f0-9]{64}$/i;

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um email válido.").max(160).transform((value) => value.toLowerCase()),
  passwordHash: z.string().trim().regex(passwordHashRegex, "Hash de senha inválido."),
  nextPathname: z.string().trim().optional()
});

export type LoginInput = z.output<typeof loginSchema>;
