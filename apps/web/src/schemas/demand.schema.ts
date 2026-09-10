import { z } from 'zod';

export const demandStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const demandFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, 'A descrição deve ter no mínimo 3 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
  responsible: z
    .string()
    .trim()
    .min(2, 'O responsável deve ter no mínimo 2 caracteres')
    .max(100, 'O responsável deve ter no máximo 100 caracteres'),
  dueDate: z
    .string()
    .min(1, 'O prazo é obrigatório')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Insira uma data válida',
    }),
  status: demandStatusEnum.default('PENDING'),
});

export type DemandFormData = z.infer<typeof demandFormSchema>;
