import { z } from 'zod';

export const serviceFormSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional().nullable(),
  url: z.string().url('Invalid URL format (must include http:// or https://)').or(z.literal('')).optional().nullable(),
  owner: z.string().optional().nullable(),
  developer: z.string().optional().nullable(),
  server: z.string().optional().nullable(),
  integration: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'UNDER_REVIEW', 'INACTIVE']),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
