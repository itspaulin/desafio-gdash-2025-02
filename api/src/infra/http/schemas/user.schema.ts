import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[a-z]/, "Senha deve conter ao menos uma letra minúscula")
  .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
  .regex(/[0-9]/, "Senha deve conter ao menos um número")
  .regex(
    /[^a-zA-Z0-9]/,
    "Senha deve conter ao menos um caractere especial (!@#$%^&*...)"
  );

const createUserInputSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: passwordSchema,
  role: z.enum(["admin", "user"]).optional(),
});

export const createUserSchema = createUserInputSchema.transform((data) => ({
  name: data.name,
  email: data.email,
  password: data.password,
  role: (data.role ?? "user") as "admin" | "user",
}));

export type CreateUserSchema = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export const updateUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres").optional(),
  email: z.string().email("Formato de email inválido").optional(),
  password: passwordSchema.optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
});

export type ListUsersQuerySchema = z.infer<typeof listUsersQuerySchema>;
