import { Router } from 'express';
import { encryptCardCode, decryptCardCode } from '../services/encryption.js';

const router = Router();

const mockCards = [
  { id: '1', denomination: 25, currency: 'USD', region: 'US', status: 'UNUSED', code: 'AMZN25-US-XXXX' },
  { id: '2', denomination: 50, currency: 'USD', region: 'US', status: 'UNUSED', code: 'AMZN50-US-XXXX' },
  { id: '3', denomination: 100, currency: 'USD', region: 'US', status: 'UNUSED', code: 'AMZN100-US-XXXX' },
  { id: '4', denomination: 5000, currency: 'NGN', region: 'NG', status: 'UNUSED', code: 'AMZN5000-NG-XXXX' },
  { id: '5', denomination: 10000, currency: 'NGN', region: 'NG', status: 'UNUSED', code: 'AMZN10000-NG-XXXX' },
];

router.get('/', (req, res) => {
  const cards = mockCards.map(card => ({
    ...card,
    code: undefined,
  }));
  res.json(cards);
});

router.post('/bulk', (req, res) => {
  const { codes } = req.body;
  
  if (!codes || !Array.isArray(codes)) {
    return res.status(400).json({ error: 'Invalid codes array' });
  }

  const encrypted = codes.map(code => {
    const { encrypted, iv } = encryptCardCode(code);
    return { codeEncrypted: encrypted, iv, status: 'UNUSED' };
  });

  res.json({ success: true, count: encrypted.length });
});

router.get('/:id', (req, res) => {
  const card = mockCards.find(c => c.id === req.params.id);
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }
  res.json({ ...card, code: undefined });
});

export default router;