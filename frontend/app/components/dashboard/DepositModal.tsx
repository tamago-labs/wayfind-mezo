'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDown } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import type { ChainConfig } from '@/lib/chains';
import { depositToUnifiedBalance } from '@/lib/deposit';


interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  selectedChain: ChainConfig;
}

export default function DepositModal({ open, onClose, selectedChain }: DepositModalProps) {
  const { getAdapter, chainId } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chainMismatch = chainId !== selectedChain.id;

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const adapter = getAdapter();
    if (!adapter) {
      setError('Wallet adapter not ready');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await depositToUnifiedBalance(adapter, selectedChain.id, amount);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setAmount('');
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Deposit failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 rounded-2xl border border-border3/50 bg-surface p-6 shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold">Deposit to Unified Balance</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[13px] text-white/60">Deposit submitted!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4 text-[12px] text-white/40">
                  <span>From: <span className="text-white/60">{selectedChain.name}</span></span>
                </div>

                {chainMismatch && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[12px] text-yellow-400">
                    Wallet is on a different network. Switch to {selectedChain.name} from the network menu to deposit.
                  </div>
                )}

                <label className="block mb-4">
                  <span className="text-[12px] text-white/40 mb-1.5 block">Amount</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-[13px] text-white/70 font-mono bg-white/[0.03] border border-border3/50 rounded-xl px-4 py-2.5 pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 font-medium">USDC</span>
                  </div>
                </label>

                <div className="flex items-center gap-2 mb-6 text-[12px] text-white/40">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Deposits to Unified Balance</span>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[12px] text-red-400">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0 || loading || chainMismatch}
                  className="w-full py-2.5 bg-accent text-white text-[13px] font-medium rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-30"
                >
                  {loading ? 'Depositing...' : 'Deposit USDC'}
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
