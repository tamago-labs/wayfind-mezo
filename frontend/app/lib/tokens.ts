import tokensJson from './tokens.json';

export interface TokenConfig {
  crypto_id: number;
  coingeckoId: string | null;
  symbol: string;
  name: string;
  decimals: number;
  logo: string | null;
  addresses: {
    arc: string | null;
    arcTestnet: string | null;
  };
}

export const TOKENS = tokensJson as TokenConfig[];

export type ChainKey = 'arc' | 'arcTestnet';

const CHAIN_ID_MAP: Record<number, ChainKey> = {
  5042: 'arc',
  5042002: 'arcTestnet',
};

export function getChainKey(chainId: number): ChainKey | null {
  return CHAIN_ID_MAP[chainId] ?? null;
}

export function getTokenAddress(symbol: string, chainId: number): string | null {
  const chainKey = getChainKey(chainId);
  if (!chainKey) return null;
  const token = TOKENS.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
  return token?.addresses[chainKey] ?? null;
}

export function getTokensWithAddress(chainId: number): TokenConfig[] {
  const chainKey = getChainKey(chainId);
  if (!chainKey) return [];
  return TOKENS.filter((t) => t.addresses[chainKey] !== null);
}

export function getTokenBySymbol(symbol: string): TokenConfig | undefined {
  return TOKENS.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getCoingeckoIds(): string {
  return TOKENS.map((t) => t.coingeckoId).filter(Boolean).join(',');
}
