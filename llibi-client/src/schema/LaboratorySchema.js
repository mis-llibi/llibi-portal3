import { z } from 'zod'

export const FORM_SCHEMA = z.object({
  laboratory: z.string().min(1, { message: 'Laboratory is required' }),
  cost: z.string().min(1, { message: 'Class 1 is required' }),
  cost2: z.string().min(1, { message: 'Class 2 is required' }),
})
