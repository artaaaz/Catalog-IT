import { z } from 'zod';

export const slaFormSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  availability: z.string().optional().nullable(),
  responseTime: z.string().optional().nullable(),
  resolutionTime: z.string().optional().nullable(),
  supportHours: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  notes: z.string().optional().nullable(),
});

export type SLAFormValues = z.infer<typeof slaFormSchema>;
