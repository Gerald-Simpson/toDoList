import { z } from 'zod';

const messageSchema = z.string().min(1);
const completeSchema = z.coerce.number().min(0).max(1);

const listItemsSchema = z.array(
  z.object({
    id: z.number().int(),
    cookieId: z.string(),
    titleId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    message: z.string(),
    complete: z.boolean(),
  }),
);

const deleteItemsSchema = z.object({
  count: z.number().min(0),
});

const singleItemSchema = z.object({
  id: z.number().int(),
  cookieId: z.string(),
  titleId: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  message: z.string(),
  complete: z.boolean(),
});

export {
  messageSchema,
  completeSchema,
  listItemsSchema,
  deleteItemsSchema,
  singleItemSchema,
};
