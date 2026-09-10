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

const imageFileSchema = z
  .custom<File>((v) => v instanceof File, 'Image must be a file')
  .refine((f) => f.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
  .refine((f) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type), 'Only JPEG, PNG, WEBP allowed')
  .optional()
  .nullable()

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
    image: imageFileSchema,
    title: titleField,
    type: wardrobeTypeSchema,
    description: descriptionField,
    status: wardrobeStatusSchema.default('available').optional(),
    store_location: storeLocationField,
    storeLocation: z.string().trim().max(150).optional(),
    borrowed_by: borrowedByField,
    borrowedBy: z.string().trim().max(150).optional(),
  })
  .transform((data) => ({
    image: (data.image as File | null) ?? null,
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

export type WardrobeCreateRawInput = {
  image?: File | null
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
    image: imageFileSchema.optional(),
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
    image: data.image as File | null | undefined,
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
