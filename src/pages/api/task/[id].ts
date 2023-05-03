import type { NextApiRequest, NextApiResponse } from 'next';
import { getTask } from '@/lib/task-manager';
import { withCorsMiddleware } from '@/middlewares/cors';
import { withTaskMiddleware } from '@/middlewares/task';
import nextConnect from 'next-connect';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const task = await getTask(String(req.query.id));

  if (task) {
    res.status(200).json({ success: true, data: task });
  } else {
    res.status(404).json({ success: false, data: null });
  }
}

export default nextConnect()
  .use(withCorsMiddleware)
  .use(withTaskMiddleware)
  .get(handler);
