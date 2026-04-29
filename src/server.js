require('dotenv').config();
const express = require('express');
const { verifyPayment } = require('./verifyPayment');
const { updateLedger } = require('./updateLedger');

const app = express();
app.use(express.json());

// POST /receipt
// Body: { txHash, fid, expectedAmount? }
app.post('/receipt', async (req, res) => {
  const { txHash, fid, expectedAmount } = req.body;
  if (!txHash || !fid) {
    return res.status(400).json({ error: 'Missing txHash or fid' });
  }

  // Verify on Tezos
  const verification = await verifyPayment(txHash, process.env.TEZOS_DESTINATION_ADDRESS);
  if (!verification.valid) {
    return res.status(400).json({ error: 'Payment not found or wrong destination' });
  }

  // Optional: check amount
  if (expectedAmount && verification.amount !== expectedAmount) {
    return res.status(400).json({ error: `Amount mismatch: expected ${expectedAmount}, got ${verification.amount}` });
  }

  // Update Base ledger (points for now)
  const points = Math.floor(parseInt(verification.amount) / 1_000_000); // 1 tez = 1,000,000 mutez → 1 point per tez
  const ledgerUpdate = updateLedger(fid, points);

  res.json({ status: 'ok', ledger: ledgerUpdate, tezosTx: txHash });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TezAnywhere listener running on port ${PORT}`);
});
