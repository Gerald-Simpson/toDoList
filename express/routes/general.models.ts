import { z } from 'zod';

export const cookieSchema = z.string().length(36);
export const idSchema = z.coerce.number().int();
