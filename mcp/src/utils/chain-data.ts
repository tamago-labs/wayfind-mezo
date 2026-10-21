import { readFileSync } from "fs";
import { join } from "path";

export interface ChainToken {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
}

export interface ChainData {
  chain: string;
  network: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { symbol: string; name: string; decimals: number };
  tokens: ChainToken[];
}

export function loadChainData(network: string): ChainData[] {
  const chains = ["mezo", "ethereum"];
  const result: ChainData[] = [];
  for (const chain of chains) {
    try {
      const file = join(process.cwd(), "src", "data", "chains", `${chain}-${network}.json`);
      const data = JSON.parse(readFileSync(file, "utf-8"));
      result.push(data);
    } catch {}
  }
  return result;
}
