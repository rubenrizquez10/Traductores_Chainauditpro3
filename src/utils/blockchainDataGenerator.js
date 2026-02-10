export function generateBlockchainData() {
  const nodes = [
    { id: '0x1a2b3c', name: 'Exchange Hub', isCritical: true, type: 'exchange' },
    { id: '0x4d5e6f', name: 'Whale Wallet', isCritical: true, type: 'wallet' },
    { id: '0x7g8h9i', name: 'DAO Treasury', isCritical: false, type: 'contract' },
    { id: '0xjklmno', name: 'Miner Pool A', isCritical: true, type: 'pool' },
    { id: '0xpqrstu', name: 'Retail Wallet 1', isCritical: false, type: 'wallet' },
    { id: '0xvwxyz0', name: 'Token Project', isCritical: false, type: 'contract' },
    { id: '0x112233', name: 'Unknown Source', isCritical: true, type: 'unknown' },
    { id: '0x445566', name: 'Market Maker', isCritical: false, type: 'exchange' }
  ];

  const transactions = [
    {
      id: 'tx_001',
      source: '0x1a2b3c',
      target: '0x4d5e6f',
      amount: 125.5,
      timestamp: Date.now() / 1000 - 3600,
      isFlagged: false
    },
    {
      id: 'tx_002',
      source: '0x4d5e6f',
      target: '0x7g8h9i',
      amount: 89.2,
      timestamp: Date.now() / 1000 - 3000,
      isFlagged: false
    },
    {
      id: 'tx_003',
      source: '0x7g8h9i',
      target: '0xjklmno',
      amount: 45.1,
      timestamp: Date.now() / 1000 - 2400,
      isFlagged: false
    },
    {
      id: 'tx_004',
      source: '0xjklmno',
      target: '0xpqrstu',
      amount: 12.3,
      timestamp: Date.now() / 1000 - 1800,
      isFlagged: false
    },
    {
      id: 'tx_005',
      source: '0xpqrstu',
      target: '0xvwxyz0',
      amount: 8.7,
      timestamp: Date.now() / 1000 - 1200,
      isFlagged: false
    },
    {
      id: 'tx_006',
      source: '0xvwxyz0',
      target: '0x1a2b3c',
      amount: 25.0,
      timestamp: Date.now() / 1000 - 600,
      isFlagged: false
    },
    {
      id: 'tx_007',
      source: '0x112233',
      target: '0x4d5e6f',
      amount: 200.0,
      timestamp: Date.now() / 1000 - 300,
      isFlagged: true
    },
    {
      id: 'tx_008',
      source: '0x4d5e6f',
      target: '0x445566',
      amount: 150.0,
      timestamp: Date.now() / 1000 - 150,
      isFlagged: true
    },
    {
      id: 'tx_009',
      source: '0x445566',
      target: '0x112233',
      amount: 180.0,
      timestamp: Date.now() / 1000,
      isFlagged: true
    },
    {
      id: 'tx_010',
      source: '0x1a2b3c',
      target: '0xpqrstu',
      amount: 5.5,
      timestamp: Date.now() / 1000 - 900,
      isFlagged: false
    }
  ];

  const links = transactions.map(tx => ({
    source: tx.source,
    target: tx.target,
    transaction: tx
  }));

  return {
    nodes,
    links,
    transactions
  };
}