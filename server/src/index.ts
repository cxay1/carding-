import express from 'express';
import cors from 'cors';
import inventoryRoutes from './routes/inventory.js';
import redemptionRoutes from './routes/redemption.js';

const app = express();
const PORT = process.env.EXPRESS_PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);
app.use('/api/redemption', redemptionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Chargeline server running on port ${PORT}`);
});

export default app;