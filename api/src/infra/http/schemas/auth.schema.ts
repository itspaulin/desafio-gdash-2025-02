import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
