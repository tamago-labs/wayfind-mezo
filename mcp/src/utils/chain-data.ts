import { readFileSync, existsSync } from "fs";
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
  nativeCurrency: { symbol: string; name: string; decimals: number };
  tokens: ChainToken[];
}

function getChainsDir(): string {
  const candidates = [
    join(__dirname, "..", "data", "chains"),
    join(process.cwd(), "mcp", "src", "data", "chains"),
    join(process.cwd(), "src", "data", "chains"),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  return candidates[0];
}

export function loadChainData(network: string): ChainData[] {
  const chains = ["mezo", "ethereum"];
  const result: ChainData[] = [];
  const chainsDir = getChainsDir();

  for (const chain of chains) {
    try {
      const file = join(chainsDir, `${chain}-${network}.json`);
      const data = JSON.parse(readFileSync(file, "utf-8"));
      result.push(data);
    } catch {}
  }

  return result;
}
