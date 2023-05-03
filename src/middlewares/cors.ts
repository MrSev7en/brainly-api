import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

export const withCorsMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
): void => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') res.status(200).end();
  else next();
};
