import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';
import { z } from 'zod';

export const withSearchMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  const schema = z.object({ query: z.string().min(1).max(4000) });
  const validation = await schema.safeParseAsync({ query: req.query.q });

  if (validation.success) {
    next();
  } else {
    res.status(400).json(validation);
  }
};
