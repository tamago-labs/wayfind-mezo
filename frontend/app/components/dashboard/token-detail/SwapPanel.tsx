'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArrowDown, ChevronDown, RefreshCw, Loader2, Check } from 'lucide-react';
import type { TokenConfig } from '@/lib/tokens';
import { getTokensWithAddress } from '@/lib/tokens';
import { useWallet } from '@/contexts/WalletContext';
import { usePrice } from '@/contexts/PriceContext';
import { fetchTokenBalance } from '@/lib/usdc';
import { ethers } from 'ethers';
import { ARC_MAINNET, ARC_TESTNET, type ChainConfig } from '@/lib/chains';

interface SwapPanelProps {
  token: TokenConfig;
}

export default function SwapPanel({ token }: SwapPanelProps) {
  const { getAdapter, chainId, address } = useWallet();
  const { getPrice } = usePrice();

  const [tokenIn] = useState<TokenConfig>(token);
  const [tokenOut, setTokenOut] = useState<TokenConfig | null>(null);
  const [amountIn, setAmountIn] = useState('');
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tokenSelectOpen, setTokenSelectOpen] = useState(false);
  const [balance, setBalance] = useState<string>('0.00');
  const [balanceLoading, setBalanceLoading] = useState(false);

  const availableTokens = chainId ? getTokensWithAddress(chainId) : [];

  useEffect(() => {
    if (!tokenSelectOpen) return;
    const handler = () => setTokenSelectOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [tokenSelectOpen]);

  useEffect(() => {
    if (!address || !chainId) {
      setBalance('0.00');
      return;
    }

    const chain: ChainConfig = chainId === 5042 ? ARC_MAINNET : ARC_TESTNET;
    const tokenAddress = chainId === 5042 ? tokenIn.addresses.arc : tokenIn.addresses.arcTestnet;

    if (!tokenAddress) {
      setBalance('0.00');
      return;
    }

    setBalanceLoading(true);
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    fetchTokenBalance(provider, tokenAddress, address, tokenIn.decimals)
      .then(setBalance)
      .catch(() => setBalance('0.00'))
      .finally(() => setBalanceLoading(false));
  }, [address, chainId, tokenIn]);

  const handleGetQuote = useCallback(async () => {
    if (!amountIn || parseFloat(amountIn) <= 0 || !tokenOut) return;

    setLoading(true);
    setError(null);
    setOutputAmount(null);

    try {
      const priceIn = getPrice(tokenIn.symbol);
      const priceOut = getPrice(tokenOut.symbol);

      if (!priceIn || !priceOut) {
        throw new Error('Price data unavailable');
      }

      const inputValue = parseFloat(amountIn) * priceIn.price;
      const outAmount = inputValue / priceOut.price;
      const formatted = outAmount.toFixed(Math.min(tokenOut.decimals, 6));
      setOutputAmount(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quote failed');
    } finally {
      setLoading(false);
    }
  }, [amountIn, tokenIn, tokenOut, getPrice]);

  const handleSwap = useCallback(async () => {
    if (!amountIn || parseFloat(amountIn) <= 0 || !tokenOut) return;

    const adapter = getAdapter();
    if (!adapter) {
      setError('Wallet adapter not ready');
      return;
    }

    setSwapping(true);
    setError(null);
    setSuccess(false);

    try {
      const { createSwapKitContext, swap } = await import('@circle-fin/swap-kit');
      const context = createSwapKitContext();

      const chainName = chainId === 5042 ? 'Arc' : chainId === 5042002 ? 'Arc_Testnet' : 'Arc';

      const result = await swap(context, {
        from: { adapter, chain: chainName },
        tokenIn: tokenIn.symbol,
        tokenOut: tokenOut.symbol,
        amountIn,
      });

      if (result.txHash) {
        setSuccess(true);
        setAmountIn('');
        setOutputAmount(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed');
    } finally {
      setSwapping(false);
    }
  }, [amountIn, tokenIn, tokenOut, getAdapter, chainId]);

  const outPrice = tokenOut ? getPrice(tokenOut.symbol) : null;
  const inPrice = getPrice(tokenIn.symbol);

  return (
    <div className="space-y-3">
      <div className="bg-white/[0.03] border border-border3/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/30">You pay</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/20">
              Balance: {balanceLoading ? '—' : balance} {tokenIn.symbol}
            </span>
            {parseFloat(balance) > 0 && (
              <button
                onClick={() => {
                  setAmountIn(balance.replace(',', ''));
                  setOutputAmount(null);
                  setSuccess(false);
                }}
                className="text-[10px] text-accent font-medium hover:text-accent/80 transition-colors"
              >
                Max
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => {
              setAmountIn(e.target.value);
              setOutputAmount(null);
              setSuccess(false);
            }}
            placeholder="0.00"
            className="flex-1 bg-transparent text-[16px] text-white/90 font-mono outline-none placeholder:text-white/20"
          />
          <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-lg px-2.5 py-1.5">
            {tokenIn.logo ? (
              <img src={tokenIn.logo} alt={tokenIn.symbol} className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-[8px] text-white/40">{tokenIn.symbol.slice(0, 2)}</span>
              </div>
            )}
            <span className="text-[12px] text-white/70 font-medium">{tokenIn.symbol}</span>
          </div>
        </div>
        {amountIn && inPrice && (
          <div className="mt-1.5">
            <span className="text-[11px] text-white/20">
              ${(parseFloat(amountIn) * inPrice.price).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            if (tokenOut) {
              setTokenOut(tokenIn);
            }
            setAmountIn('');
            setOutputAmount(null);
          }}
          className="p-2 rounded-full bg-white/[0.04] border border-border3/30 text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white/[0.03] border border-border3/50 rounded-xl p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/30">You receive</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-[16px] text-white/90 font-mono">
            {outputAmount ?? '—'}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTokenSelectOpen(!tokenSelectOpen);
              }}
              className="flex items-center gap-1.5 bg-white/[0.06] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-white/[0.1] transition-colors min-w-[100px] justify-between"
            >
              {tokenOut ? (
                <>
                  {tokenOut.logo ? (
                    <img src={tokenOut.logo} alt={tokenOut.symbol} className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[8px] text-white/40">{tokenOut.symbol.slice(0, 2)}</span>
                    </div>
                  )}
                  <span className="text-[12px] text-white/70 font-medium">{tokenOut.symbol}</span>
                </>
              ) : (
                <span className="text-[12px] text-white/40">Select</span>
              )}
              <ChevronDown className="w-3 h-3 text-white/30" />
            </button>

            {tokenSelectOpen && (
              <div className="absolute right-0 top-full mt-1 bg-surface border border-border3/50 rounded-xl p-1.5 min-w-[120px] z-20 shadow-xl">
                {availableTokens
                  .filter((t: TokenConfig) => t.symbol !== tokenIn.symbol)
                  .map((t: TokenConfig) => (
                    <button
                      key={t.symbol}
                      onClick={() => {
                        setTokenOut(t);
                        setTokenSelectOpen(false);
                        setOutputAmount(null);
                        setSuccess(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      {t.logo ? (
                        <img src={t.logo} alt={t.symbol} className="w-5 h-5 rounded-full" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-[8px] text-white/40">{t.symbol.slice(0, 2)}</span>
                        </div>
                      )}
                      <span className="text-[12px] text-white/70 font-medium">{t.symbol}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        {outputAmount && outPrice && (
          <div className="mt-1.5">
            <span className="text-[11px] text-white/20">
              ${(parseFloat(outputAmount) * outPrice.price).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {!outputAmount && amountIn && parseFloat(amountIn) > 0 && tokenOut && (
        <button
          onClick={handleGetQuote}
          disabled={loading}
          className="w-full py-2.5 bg-white/[0.06] text-white/60 text-[13px] font-medium rounded-xl hover:bg-white/[0.1] transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Getting quote...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Get Quote
            </>
          )}
        </button>
      )}

      {outputAmount && (
        <button
          onClick={handleSwap}
          disabled={swapping || success}
          className="w-full py-2.5 bg-accent text-white text-[13px] font-medium rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
        >
          {swapping ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Swapping...
            </>
          ) : success ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Swap Submitted
            </>
          ) : (
            <>Swap {tokenIn.symbol} to {tokenOut?.symbol}</>
          )}
        </button>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[12px] text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
