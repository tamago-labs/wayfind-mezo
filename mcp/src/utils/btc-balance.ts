export interface BtcBalanceResult {
  chain: string;
  chainId: number;
  native: { symbol: string; balance: string };
  tokens: [];
}

export async function getBtcBalance(
  btcAddress: string,
  chainId: number = 31611
): Promise<BtcBalanceResult> {
  const url = `https://blockstream.info/testnet/api/address/${btcAddress}`;
  const res = await fetch(url);
  const data = await res.json();

  const funded = data.chain_stats.funded_txo_sum;
  const spent = data.chain_stats.spent_txo_sum;
  const balanceSats = funded - spent;
  const balanceBtc = (balanceSats / 100_000_000).toFixed(8);

  return {
    chain: "bitcoin",
    chainId,
    native: { symbol: "BTC", balance: balanceBtc },
    tokens: [],
  };
}
