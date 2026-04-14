import { Router } from 'express';
import { decryptCardCode } from '../services/encryption.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const redisStore = new Map<string, { count: number; resetTime: number }>();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Rate limit exceeded. Try again later.' },
  keyGenerator: (req) => req.body.userId || req.ip,
});

router.use(limiter);

router.post('/', (req, res) => {
  const { code, userId } = req.body;

  if (!code || !userId) {
    return res.status(400).json({ error: 'Missing code or userId' });
  }

  const now = Date.now();
  const key = `${userId}:redeem`;
  const record = redisStore.get(key);

  if (record && now <= record.resetTime && record.count >= 5) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  if (!record || now > record.resetTime) {
    redisStore.set(key, { count: 1, resetTime: now + 3600000 });
  } else {
    record.count++;
  }

  try {
    const decrypted = decryptCardCode(code, '');
    
    if (decrypted.includes('XXXX')) {
      return res.json({ 
        success: true, 
        message: 'Code redeemed successfully',
        balance: 50 
      });
    }
    
    res.status(400).json({ error: 'Invalid code' });
  } catch {
    res.status(400).json({ error: 'Invalid code format' });
  }
});

export default router;