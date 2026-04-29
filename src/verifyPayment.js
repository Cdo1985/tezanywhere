require('dotenv').config();
const { TezosToolkit } = require('@taquito/taquito');

const tezos = new TezosToolkit(process.env.TEZOS_RPC_URL);

async function verifyPayment(txHash, expectedDestination) {
  try {
    const operation = await tezos.rpc.getOperation(txHash);
    const contents = operation[0]?.contents || [];
    for (const content of contents) {
      if (content.kind === 'transaction' && content.destination === expectedDestination) {
        console.log(`✅ Payment verified: ${content.amount} mutez to ${content.destination}`);
        return { valid: true, amount: content.amount, destination: content.destination };
      }
    }
    console.log('❌ No matching transaction found');
    return { valid: false };
  } catch (err) {
    console.error('Verification error:', err.message);
    return { valid: false, error: err.message };
  }
}

// CLI usage: node src/verifyPayment.js --hash=<txHash>
if (require.main === module) {
  const args = process.argv.slice(2);
  const hashArg = args.find(arg => arg.startsWith('--hash='));
  if (!hashArg) {
    console.error('Usage: node verifyPayment.js --hash=<transaction_hash>');
    process.exit(1);
  }
  const txHash = hashArg.split('=')[1];
  verifyPayment(txHash, process.env.TEZOS_DESTINATION_ADDRESS).then(console.log);
}

module.exports = { verifyPayment };
