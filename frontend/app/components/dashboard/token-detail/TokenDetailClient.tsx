'use client';

import { usePrice } from '@/contexts/PriceContext';
import { useEarn } from '@/contexts/EarnContext';
import type { TokenConfig } from '@/lib/tokens';
import TokenDetailHeader from './TokenDetailHeader';
import ActionPanel from './ActionPanel';
import PriceChart from './PriceChart';
import TokenDetailInfo from './TokenDetailInfo';

export default function TokenDetailClient({ token }: { token: TokenConfig }) {
  const { getPrice } = usePrice();
  const { getBestApy } = useEarn();

  const priceData = getPrice(token.symbol);
  const earnApy = getBestApy(token.symbol);

  return (
    <div className="space-y-6">
      <TokenDetailHeader token={token} priceData={priceData} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ActionPanel token={token} earnApy={earnApy} />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <PriceChart token={token} />
          <TokenDetailInfo token={token} priceData={priceData} earnApy={earnApy} />
        </div>
      </div>
    </div>
  );
}
