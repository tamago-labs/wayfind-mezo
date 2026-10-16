'use client';

import type { TokenConfig } from '@/lib/tokens';
import type { PriceData } from '@/lib/price-types';
import { ExternalLink } from 'lucide-react';

function formatLarge(value: number): string {
  if (value === 0) return '—';
  if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return '$' + (value / 1e3).toFixed(1) + 'K';
  return '$' + value.toFixed(2);
}

function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export default function TokenDetailInfo({
  token,
  priceData,
  earnApy,
}: {
  token: TokenConfig;
  priceData: PriceData | null;
  earnApy: number | null;
}) {
  const arcMainnetAddress = token.addresses.arc;
  const arcTestnetAddress = token.addresses.arcTestnet;

  return (
    <div className="bg-surface border border-border3/50 rounded-2xl p-5">
      <h3 className="text-[12px] text-white/30 uppercase tracking-wider mb-4">{token.symbol} Info</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/30">Market Cap</span>
          <span className="text-white/70">{formatLarge(priceData?.marketCap ?? 0)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/30">Volume 24h</span>
          <span className="text-white/70">{formatLarge(priceData?.volume24h ?? 0)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/30">Best Earn APY</span>
          <span className="text-white/70">{earnApy != null ? `${(earnApy * 100).toFixed(2)}%` : '—'}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/30">Best Borrow APY</span>
          <span className="text-white/70">Coming soon</span>
        </div>

        {arcMainnetAddress && (
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-white/30">Arc Mainnet</span>
            <a
              href={`https://explorer.arc.io/address/${arcMainnetAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
            >
              <span className="font-mono">{truncateAddress(arcMainnetAddress)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {arcTestnetAddress && (
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-white/30">Arc Testnet</span>
            <a
              href={`https://explorer.testnet.arc.io/address/${arcTestnetAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
            >
              <span className="font-mono">{truncateAddress(arcTestnetAddress)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
