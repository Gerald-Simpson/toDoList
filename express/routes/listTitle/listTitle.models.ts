import { z } from 'zod';

const titleSchema = z.string().min(1);

const listTitleSchema = z.array(
  z.object({
    id: z.number().int(),
    cookieId: z.string(),
    createdAt: z.coerce.date(),
    title: z.string(),
  }),
);

const singleTitleSchema = z.object({
  id: z.number().int(),
  cookieId: z.string(),
  createdAt: z.coerce.date(),
  title: z.string(),
});

export { titleSchema, listTitleSchema, singleTitleSchema };
