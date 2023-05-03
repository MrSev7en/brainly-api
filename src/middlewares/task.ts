import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';
import { z } from 'zod';

export const withTaskMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  const schema = z.object({ id: z.string() });
  const validation = await schema.safeParseAsync({ id: req.query.id });

  if (validation.success) {
    next();
  } else {
    res.status(400).json(validation);
  }
};
