import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    message: 'API route is working',
    env: {
      hasPaymentUrl: !!process.env.PAYMENT_CONFIRM_URL,
      hasSecretKey: !!process.env.TOSS_SECRET_KEY,
    },
  });
}
