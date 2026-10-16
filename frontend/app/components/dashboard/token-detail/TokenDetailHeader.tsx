'use client';

import type { TokenConfig } from '@/lib/tokens';
import type { PriceData } from '@/lib/price-types';

function formatPrice(price: number): string {
  if (price === 0) return '—';
  if (price < 1) return '$' + price.toFixed(6);
  if (price < 1000) return '$' + price.toFixed(2);
  return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TokenDetailHeader({ token, priceData }: { token: TokenConfig; priceData: PriceData | null }) {
  return (
    <div className="flex items-center gap-4">
      {token.logo ? (
        <img src={token.logo} alt={token.symbol} className="w-12 h-12 rounded-full" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-[14px] text-white/40 font-medium">{token.symbol.slice(0, 3)}</span>
        </div>
      )}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold">{token.symbol}</h1>
          <span className="text-[13px] text-white/30">{token.name}</span>
        </div>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-xl font-semibold text-white/90">
            {priceData ? formatPrice(priceData.price) : '—'}
          </span>
          {priceData && (
            <span className={`text-[13px] font-medium ${priceData.percentChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {priceData.percentChange24h >= 0 ? '+' : ''}{priceData.percentChange24h.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
