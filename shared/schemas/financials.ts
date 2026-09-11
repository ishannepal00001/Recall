import { z } from 'zod'

export const financialTypeSchema = z.enum(['income', 'expense'])
export type FinancialType = z.infer<typeof financialTypeSchema>

export const financialCategorySchema = z.enum([
  'salary',
  'freelance',
  'investment',
  'gift',
  'other_income',
  'food',
  'transport',
  'housing',
  'utilities',
  'healthcare',
  'entertainment',
  'shopping',
  'education',
  'other_expense',
])
export type FinancialCategory = z.infer<typeof financialCategorySchema>

const titleField = z.string().trim().min(1, 'Title is required').max(150, 'Title must be at most 150 characters')

const descriptionField = z
  .string()
  .trim()
  .max(2000, 'Description must be at most 2000 characters')
  .optional()
  .nullable()
  .or(z.literal('').transform(() => null))

const amountField = z
  .number({ message: 'Amount is required and must be a number' })
  .positive('Amount must be greater than 0')
  .max(1_000_000_000, 'Amount is too large')
  .refine((v) => Number.isFinite(v), 'Amount must be a finite number')

const amountCoercedField = z.coerce.number().positive('Amount must be greater than 0').max(1_000_000_000)

const dateField = z
  .string()
  .trim()
  .min(1, 'Date is required')
  .refine((v) => !isNaN(Date.parse(v)), 'Invalid date format (use ISO 8601)')

const categoryField = financialCategorySchema

export const financialCreateSchema = z.object({
  title: titleField,
  amount: amountField.or(amountCoercedField),
  type: financialTypeSchema,
  category: categoryField,
  description: descriptionField,
  date: dateField,
})

export type FinancialCreateInput = z.infer<typeof financialCreateSchema>

export type FinancialCreateRawInput = {
  title: string
  amount: number
  type: FinancialType
  category: FinancialCategory
  description?: string | null
  date: string
}

export const financialUpdateSchema = z
  .object({
    title: titleField.optional(),
    amount: amountCoercedField.optional(),
    type: financialTypeSchema.optional(),
    category: categoryField.optional(),
    description: descriptionField.optional(),
    date: dateField.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  })

export type FinancialUpdateInput = z.infer<typeof financialUpdateSchema>

export const financialIdParamSchema = z.object({
  id: z.string().min(1, 'Financial record id is required').max(100),
})
export type FinancialIdParam = z.infer<typeof financialIdParamSchema>

export const financialQuerySchema = z.object({
  type: financialTypeSchema.optional(),
  category: financialCategorySchema.optional(),
  search: z.string().trim().max(100).optional(),
  date_from: z.string().trim().optional(),
  date_to: z.string().trim().optional(),
  min_amount: z.coerce.number().optional(),
  max_amount: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'date', 'amount', 'title']).default('date').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
})
export type FinancialQueryInput = z.infer<typeof financialQuerySchema>
