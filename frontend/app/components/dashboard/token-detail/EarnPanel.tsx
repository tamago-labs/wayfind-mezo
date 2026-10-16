'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, TrendingUp, Vault } from 'lucide-react';
import type { TokenConfig } from '@/lib/tokens';
import { useWallet } from '@/contexts/WalletContext';
import { useEarn } from '@/contexts/EarnContext';

interface EarnPanelProps {
  token: TokenConfig;
  earnApy: number | null;
}

export default function EarnPanel({ token, earnApy }: EarnPanelProps) {
  const { getAdapter, chainId, address } = useWallet();
  const { getVaultsForAsset } = useEarn();

  const [tab, setTab] = useState<'Deposit' | 'Withdraw'>('Deposit');
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{
    currentBalance: string;
    shares: string;
    principalDeposited: string;
    totalYieldEarned: string;
  } | null>(null);

  const vaults = getVaultsForAsset(token.symbol).filter((v) => v.status === 'active');
  const vaultAddress = selectedVault ?? vaults[0]?.vaultAddress ?? null;

  const handleDeposit = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0 || !vaultAddress) return;

    const adapter = getAdapter();
    if (!adapter) {
      setError('Wallet adapter not ready');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { createEarnKitContext, deposit } = await import('@circle-fin/earn-kit');
      const context = createEarnKitContext();

      const chainName = chainId === 5042 ? 'Arc' : chainId === 5042002 ? 'Arc_Testnet' : 'Arc';

      const result = await deposit(context, {
        from: { adapter, chain: chainName },
        vaultAddress,
        amount,
      });

      if (result.txHash) {
        setSuccess(true);
        setAmount('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setLoading(false);
    }
  }, [amount, vaultAddress, getAdapter, chainId]);

  const handleWithdraw = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0 || !vaultAddress) return;

    const adapter = getAdapter();
    if (!adapter) {
      setError('Wallet adapter not ready');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { createEarnKitContext, withdraw } = await import('@circle-fin/earn-kit');
      const context = createEarnKitContext();

      const chainName = chainId === 5042 ? 'Arc' : chainId === 5042002 ? 'Arc_Testnet' : 'Arc';

      const result = await withdraw(context, {
        from: { adapter, chain: chainName, address: address ?? undefined },
        vaultAddress,
        amount,
      });

      if (result.txHash) {
        setSuccess(true);
        setAmount('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  }, [amount, vaultAddress, address, getAdapter, chainId]);

  const handleGetPosition = useCallback(async () => {
    if (!vaultAddress) return;

    const adapter = getAdapter();
    if (!adapter) return;

    try {
      const { createEarnKitContext, getPosition } = await import('@circle-fin/earn-kit');
      const context = createEarnKitContext();

      const chainName = chainId === 5042 ? 'Arc' : chainId === 5042002 ? 'Arc_Testnet' : 'Arc';

      const pos = await getPosition(context, {
        from: { adapter, chain: chainName },
        vaultAddress,
      });

      if (pos) {
        setPosition({
          currentBalance: pos.currentBalance ?? '0',
          shares: pos.shares ?? '0',
          principalDeposited: pos.pnl?.status === 'available' ? pos.pnl.principalDeposited : '0',
          totalYieldEarned: pos.pnl?.status === 'available' ? pos.pnl.totalYieldEarned : '0',
        });
      }
    } catch {
      setPosition(null);
    }
  }, [vaultAddress, getAdapter, chainId]);

  return (
    <div className="bg-surface border border-border3/50 rounded-2xl overflow-hidden">
      <div className="flex border-b border-border3/50">
        <button
          onClick={() => setTab('Deposit')}
          className={`flex-1 py-3 text-[13px] font-medium transition-colors relative ${
            tab === 'Deposit' ? 'text-white' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Deposit
          {tab === 'Deposit' && (
            <motion.div layoutId="earn-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
        <button
          onClick={() => { setTab('Withdraw'); handleGetPosition(); }}
          className={`flex-1 py-3 text-[13px] font-medium transition-colors relative ${
            tab === 'Withdraw' ? 'text-white' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Withdraw
          {tab === 'Withdraw' && (
            <motion.div layoutId="earn-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
      </div>

      <div className="p-5">
      {vaults.length === 0 ? (
        <div className="text-center py-8">
          <Vault className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-[13px] text-white/30">No earn vaults for {token.symbol}</p>
          <p className="text-[11px] text-white/15 mt-1">This asset is not supported for earning yet</p>
        </div>
      ) : (
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {tab === 'Deposit' && (
            <div className="space-y-4">
              {vaults.length > 1 && (
                <div>
                  <span className="text-[11px] text-white/30 block mb-1.5">Vault</span>
                  <select
                    value={vaultAddress ?? ''}
                    onChange={(e) => setSelectedVault(e.target.value || null)}
                    className="w-full bg-white/[0.03] border border-border3/50 rounded-lg px-3 py-2 text-[12px] text-white/60 outline-none cursor-pointer"
                  >
                    {vaults.map((v) => (
                      <option key={v.vaultAddress} value={v.vaultAddress} className="bg-dark text-white/70">
                        {v.name} ({(v.currentApy * 100).toFixed(2)}% APY)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <span className="text-[11px] text-white/30 block mb-1.5">Amount</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setSuccess(false); }}
                  placeholder="0.00"
                  className="w-full bg-white/[0.03] border border-border3/50 rounded-lg px-3 py-2.5 text-[14px] text-white/90 font-mono outline-none placeholder:text-white/20"
                />
              </div>

              {earnApy != null && (
                <div className="flex items-center gap-1.5 text-[12px] text-white/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>APY: {(earnApy * 100).toFixed(2)}%</span>
                </div>
              )}

              <button
                onClick={handleDeposit}
                disabled={loading || success || !amount || parseFloat(amount) <= 0}
                className="w-full py-2.5 bg-accent text-white text-[13px] font-medium rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Depositing...</>
                ) : success ? (
                  <><Check className="w-3.5 h-3.5" /> Deposited</>
                ) : (
                  `Deposit ${token.symbol}`
                )}
              </button>
            </div>
          )}

          {tab === 'Withdraw' && (
            <div className="space-y-4">
              {position && (
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <p className="text-[11px] text-white/20">Your Balance</p>
                    <p className="text-[13px] text-white/70 mt-0.5">{position.currentBalance} {token.symbol}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/20">Yield Earned</p>
                    <p className="text-[13px] text-emerald-400 mt-0.5">+{position.totalYieldEarned}</p>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] text-white/30 block mb-1.5">Amount</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setSuccess(false); }}
                  placeholder="0.00"
                  className="w-full bg-white/[0.03] border border-border3/50 rounded-lg px-3 py-2.5 text-[14px] text-white/90 font-mono outline-none placeholder:text-white/20"
                />
              </div>

              <button
                onClick={handleWithdraw}
                disabled={loading || success || !amount || parseFloat(amount) <= 0}
                className="w-full py-2.5 bg-accent text-white text-[13px] font-medium rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Withdrawing...</>
                ) : success ? (
                  <><Check className="w-3.5 h-3.5" /> Withdrawn</>
                ) : (
                  `Withdraw ${token.symbol}`
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[12px] text-red-400">
              {error}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      )}
      </div>
    </div>
  );
}
