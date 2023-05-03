import type { NextApiRequest, NextApiResponse } from 'next';
import { searchTask } from '@/lib/task-manager';
import { withCorsMiddleware } from '@/middlewares/cors';
import { withSearchMiddleware } from '@/middlewares/search';
import nextConnect from 'next-connect';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const task = await searchTask(String(req.query.q));

  if (task) {
    res.status(200).json({ success: true, data: task });
  } else {
    res.status(404).json({ success: false, data: null });
  }
}

export default nextConnect()
  .use(withCorsMiddleware)
  .use(withSearchMiddleware)
  .get(handler);
