import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
