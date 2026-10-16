'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { usePrice } from '@/contexts/PriceContext';
import { fetchUnifiedBalance, type UnifiedBalanceResult } from '@/lib/unified-balance';
import type { ChainConfig } from '@/lib/chains';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

interface UnifiedBalanceProps {
  selectedChain: ChainConfig;
}

export default function UnifiedBalance({ selectedChain }: UnifiedBalanceProps) {
  const { address, chainId, getAdapter } = useWallet();
  const { getPrice } = usePrice();
  const [balance, setBalance] = useState<UnifiedBalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    if (!address || !chainId) {
      setBalance(null);
      return;
    }

    const adapter = getAdapter();
    if (!adapter) {
      setBalance(null);
      return;
    }

    setLoading(true);
    fetchUnifiedBalance(adapter as never, address, selectedChain.id)
      .then(setBalance)
      .catch(() => setBalance(null))
      .finally(() => setLoading(false));
  }, [address, chainId, selectedChain, getAdapter]);

  if (!address) {
    return (
      <div className="bg-surface border border-border3/50 rounded-2xl p-6">
        <p className="text-[12px] text-white/30 uppercase tracking-wider mb-3">Unified Balance</p>
        <p className="text-[13px] text-white/40">Connect wallet to view balance</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border3/50 rounded-2xl p-6 relative">
      <p className="text-[12px] text-white/30 uppercase tracking-wider mb-1">Unified Balance</p>
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowBreakdown(true)}
        onMouseLeave={() => setShowBreakdown(false)}
      >
        {loading ? (
          <div className="shimmer h-7 w-36 mt-1" />
        ) : (
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold cursor-help">
              {balance ? `${balance.totalConfirmed} USDC` : '0.00 USDC'}
            </p>
            {(() => {
              if (!balance) return null;
              const usdcPrice = getPrice('USDC');
              const usdValue = usdcPrice
                ? '$' + (parseFloat(balance.totalConfirmed.replace(',', '')) * usdcPrice.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : null;
              return usdValue ? <span className="text-[13px] text-white/30">{usdValue}</span> : null;
            })()}
          </div>
        )}

        <AnimatePresence>
          {showBreakdown && balance && balance.chains.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 bg-dark border border-border3/50 rounded-xl p-4 min-w-[200px] z-30 shadow-xl"
            >
              <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">Breakdown by Network</p>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-hide">
                {balance.chains.map((item) => (
                  <div key={item.chain} className="flex items-center justify-between text-[12px] gap-4">
                    <span className="text-white/40 truncate">{item.chain}</span>
                    <span className="text-white/60 shrink-0">{item.confirmed}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setDepositOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-accent text-white text-[12px] font-medium rounded-lg hover:bg-accent/80 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          Deposit
        </button>
        <button
          onClick={() => setWithdrawOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/[0.06] text-white/70 text-[12px] font-medium rounded-lg hover:bg-white/[0.1] transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          Withdraw
        </button>
      </div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} selectedChain={selectedChain} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} selectedChain={selectedChain} />
    </div>
  );
}
