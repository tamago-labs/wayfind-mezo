import { JsonRpcProvider, Contract, formatUnits } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

export interface BalanceResult {
  chain: string;
  chainId: number;
  native: { symbol: string; balance: string };
  tokens: Array<{ symbol: string; name: string; address: string; balance: string; decimals: number }>;
}

export async function getEvmBalances(
  rpcUrl: string,
  chainId: number,
  chainName: string,
  nativeSymbol: string,
  tokens: Array<{ symbol: string; name: string; decimals: number; address: string }>,
  walletAddress: string
): Promise<BalanceResult> {
  const provider = new JsonRpcProvider(rpcUrl);
  const nativeBalance = await provider.getBalance(walletAddress);
  const nativeFormatted = formatUnits(nativeBalance, 18);

  const tokenBalances: BalanceResult["tokens"] = [];
  for (const token of tokens) {
    try {
      const contract = new Contract(token.address, ERC20_ABI, provider);
      const bal = await contract.balanceOf(walletAddress);
      if (bal > 0n) {
        tokenBalances.push({
          symbol: token.symbol,
          name: token.name,
          address: token.address,
          balance: formatUnits(bal, token.decimals),
          decimals: token.decimals,
        });
      }
    } catch {}
  }

  return {
    chain: chainName,
    chainId,
    native: { symbol: nativeSymbol, balance: nativeFormatted },
    tokens: tokenBalances,
  };
}
