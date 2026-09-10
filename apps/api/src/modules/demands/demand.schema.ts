import { z } from 'zod';

export const demandStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
  errorMap: () => ({ message: 'Status deve ser PENDING, IN_PROGRESS ou COMPLETED' }),
});

export const createDemandSchema = z.object({
  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .trim()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  responsible: z
    .string({ required_error: 'Responsável é obrigatório' })
    .trim()
    .min(2, 'Responsável deve ter no mínimo 2 caracteres')
    .max(100, 'Responsável deve ter no máximo 100 caracteres'),
  dueDate: z
    .string({ required_error: 'Prazo é obrigatório' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Prazo deve ser uma data válida (ISO 8601 ou YYYY-MM-DD)',
    })
    .transform((val) => new Date(val)),
  status: demandStatusSchema.default('PENDING'),
});

export const updateDemandSchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  responsible: z
    .string()
    .trim()
    .min(2, 'Responsável deve ter no mínimo 2 caracteres')
    .max(100, 'Responsável deve ter no máximo 100 caracteres')
    .optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Prazo deve ser uma data válida',
    })
    .transform((val) => new Date(val))
    .optional(),
  status: demandStatusSchema.optional(),
});

export const updateStatusSchema = z.object({
  status: demandStatusSchema,
});

export const listDemandsQuerySchema = z.object({
  status: demandStatusSchema.optional(),
  responsible: z.string().trim().optional(),
  search: z.string().trim().optional(),
  isOverdue: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type CreateDemandInput = z.infer<typeof createDemandSchema>;
export type UpdateDemandInput = z.infer<typeof updateDemandSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ListDemandsQuery = z.infer<typeof listDemandsQuerySchema>;
