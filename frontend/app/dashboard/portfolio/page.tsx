'use client';

import { useState } from 'react';
import NetworkSelector from '@/components/dashboard/NetworkSelector';
import UnifiedBalance from '@/components/dashboard/UnifiedBalance';
import TokenList from '@/components/dashboard/TokenList';
import { useWallet } from '@/contexts/WalletContext';
import { ARC_MAINNET, type ChainConfig } from '@/lib/chains';

export default function PortfolioPage() {
  const { address } = useWallet();
  const [selectedChain, setSelectedChain] = useState<ChainConfig>(ARC_MAINNET);

  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <NetworkSelector selected={selectedChain} onSelect={setSelectedChain} />
          <UnifiedBalance selectedChain={selectedChain} />
        </div>
        <div className="lg:col-span-2">
          <TokenList selectedChain={selectedChain} address={address} />
        </div>
      </div>
    </div>
  );
}
