import { z } from 'zod'

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * Type of wardrobe item.
 * - accessory: any accessory (hat, belt, watch, etc.)
 * - shirt_long_sleeved / shirt_short_sleeved: split shirt variants
 * - pant: trousers / pants
 */
export const wardrobeTypeSchema = z.enum([
  'accessory',
  'shirt_long_sleeved',
  'shirt_short_sleeved',
  'pant',
])
export type WardrobeType = z.infer<typeof wardrobeTypeSchema>

/**
 * Status of a wardrobe item.
 * - available: in wardrobe, ready to use
 * - in_use: currently being worn / in use
 * - to_wash: sent to wash
 * - needs_wash: should be washed (worn but not yet sent)
 * - borrowed: borrowed by someone (requires borrowed_by)
 */
export const wardrobeStatusSchema = z.enum([
  'available',
  'in_use',
  'to_wash',
  'needs_wash',
  'borrowed',
])
export type WardrobeStatus = z.infer<typeof wardrobeStatusSchema>

// ---------------------------------------------------------------------------
// Shared field helpers
// ---------------------------------------------------------------------------

const imageUrlField = z
  .string()
  .url('Image URL must be a valid URL')
  .max(2048, 'Image URL too long')
  .optional()
  .nullable()
  .or(z.literal('').transform(() => null))

const titleField = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(150, 'Title must be at most 150 characters')

const descriptionField = z
  .string()
  .trim()
  .max(2000, 'Description must be at most 2000 characters')
  .optional()
  .nullable()
  .or(z.literal('').transform(() => null))

const storeLocationField = z
  .string()
  .trim()
  .max(150, 'Store location must be at most 150 characters')
  .optional()
  .nullable()
  .or(z.literal('').transform(() => null))

const borrowedByField = z
  .string()
  .trim()
  .max(150, 'Borrowed by must be at most 150 characters')
  .optional()
  .nullable()
  .or(z.literal('').transform(() => null))

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export const wardrobeCreateSchema = z
  .object({
    image_url: imageUrlField,
    imageUrl: z.string().url().max(2048).optional(), // alias for camelCase clients
    title: titleField,
    type: wardrobeTypeSchema,
    description: descriptionField,
    status: wardrobeStatusSchema.default('available').optional(),
    store_location: storeLocationField,
    storeLocation: z.string().trim().max(150).optional(), // alias
    borrowed_by: borrowedByField,
    borrowedBy: z.string().trim().max(150).optional(), // alias
  })
  .transform((data) => ({
    image_url: (data.image_url ?? (data as any).imageUrl ?? null) as string | null,
    title: data.title,
    type: data.type,
    description: (data.description as string | null) ?? null,
    status: (data.status ?? 'available') as WardrobeStatus,
    store_location: (data.store_location ?? (data as any).storeLocation ?? null) as string | null,
    borrowed_by: (data.borrowed_by ?? (data as any).borrowedBy ?? null) as string | null,
  }))
  .superRefine((data, ctx) => {
    if (data.status === 'borrowed' && !data.borrowed_by) {
      ctx.addIssue({
        code: 'custom',
        message: 'borrowed_by is required when status is borrowed',
        path: ['borrowed_by'],
      })
    }
    if (data.status !== 'borrowed' && data.borrowed_by) {
      ctx.addIssue({
        code: 'custom',
        message: 'borrowed_by should only be set when status is borrowed',
        path: ['borrowed_by'],
      })
    }
  })

export type WardrobeCreateInput = z.infer<typeof wardrobeCreateSchema>

// Stripped inferred type after transform is flat; re-export raw for docs if needed
export type WardrobeCreateRawInput = {
  image_url?: string | null
  title: string
  type: WardrobeType
  description?: string | null
  status?: WardrobeStatus
  store_location?: string | null
  borrowed_by?: string | null
}

// ---------------------------------------------------------------------------
// Update (all fields optional, same borrowed_by rules)
// ---------------------------------------------------------------------------

export const wardrobeUpdateSchema = z
  .object({
    image_url: imageUrlField.optional(),
    imageUrl: z.string().url().max(2048).optional(),
    title: titleField.optional(),
    type: wardrobeTypeSchema.optional(),
    description: descriptionField.optional(),
    status: wardrobeStatusSchema.optional(),
    store_location: storeLocationField.optional(),
    storeLocation: z.string().trim().max(150).optional(),
    borrowed_by: borrowedByField.optional(),
    borrowedBy: z.string().trim().max(150).optional(),
  })
  .transform((data) => ({
    image_url: (data.image_url ?? (data as any).imageUrl) as string | null | undefined,
    title: data.title,
    type: data.type,
    description: data.description as string | null | undefined,
    status: data.status,
    store_location: (data.store_location ?? (data as any).storeLocation) as string | null | undefined,
    borrowed_by: (data.borrowed_by ?? (data as any).borrowedBy) as string | null | undefined,
  }))
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  })
  .superRefine((data, ctx) => {
    // If status is being set to borrowed, borrowed_by must be present (either in payload or existing - controller will handle existing check)
    // Here we only catch obvious mismatch in the same payload.
    if (data.status === 'borrowed' && data.borrowed_by === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'borrowed_by cannot be null when status is borrowed',
        path: ['borrowed_by'],
      })
    }
    if (data.status !== undefined && data.status !== 'borrowed' && data.borrowed_by !== undefined && data.borrowed_by !== null) {
      ctx.addIssue({
        code: 'custom',
        message: 'borrowed_by should only be set when status is borrowed',
        path: ['borrowed_by'],
      })
    }
  })

export type WardrobeUpdateInput = z.infer<typeof wardrobeUpdateSchema>

// ---------------------------------------------------------------------------
// Params & Query
// ---------------------------------------------------------------------------

export const wardrobeIdParamSchema = z.object({
  id: z.string().min(1, 'Wardrobe item id is required').max(100),
})
export type WardrobeIdParam = z.infer<typeof wardrobeIdParamSchema>

export const wardrobeQuerySchema = z.object({
  type: wardrobeTypeSchema.optional(),
  status: wardrobeStatusSchema.optional(),
  search: z.string().trim().max(100).optional(),
  store_location: z.string().trim().max(150).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'type', 'status']).default('created_at').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
})
export type WardrobeQueryInput = z.infer<typeof wardrobeQuerySchema>
