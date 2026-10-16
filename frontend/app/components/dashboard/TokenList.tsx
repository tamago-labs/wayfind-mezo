'use client';

import { useEffect, useState } from 'react';
import type { ChainConfig } from '@/lib/chains';
import { getTokensWithAddress, type TokenConfig } from '@/lib/tokens';
import { fetchTokenBalance } from '@/lib/usdc';
import { usePrice } from '@/contexts/PriceContext';
import { ethers } from 'ethers';

interface TokenListProps {
  selectedChain: ChainConfig;
  address: string | null;
}

interface TokenBalance {
  token: TokenConfig;
  balance: string | null;
}

function formatUSD(value: number): string {
  if (value === 0) return '—';
  if (value < 0.01) return '$' + value.toFixed(6);
  return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPrice(price: number): string {
  if (price === 0) return '—';
  if (price < 1) return '$' + price.toFixed(6);
  if (price < 1000) return '$' + price.toFixed(2);
  return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TokenList({ selectedChain, address }: TokenListProps) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const { getPrice } = usePrice();

  useEffect(() => {
    if (!address) {
      setBalances([]);
      return;
    }

    const tokens = getTokensWithAddress(selectedChain.id);
    if (tokens.length === 0) {
      setBalances([]);
      return;
    }

    const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);

    setBalances(tokens.map((t) => ({ token: t, balance: null })));

    tokens.forEach((token, index) => {
      const chainKey = selectedChain.id === 5042 ? 'arc' : 'arcTestnet';
      const tokenAddress = token.addresses[chainKey as 'arc' | 'arcTestnet'];

      if (!tokenAddress) {
        setBalances((prev) => prev.map((b, i) => (i === index ? { ...b, balance: '0.00' } : b)));
        return;
      }

      fetchTokenBalance(provider, tokenAddress, address, token.decimals)
        .then((balance) => {
          setBalances((prev) => prev.map((b, i) => (i === index ? { ...b, balance } : b)));
        })
        .catch(() => {
          setBalances((prev) => prev.map((b, i) => (i === index ? { ...b, balance: '0.00' } : b)));
        });
    });
  }, [address, selectedChain]);

  const tokens = getTokensWithAddress(selectedChain.id);

  return (
    <div className="bg-surface border border-border3/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border3/50 flex items-center justify-between">
        <p className="text-[12px] text-white/30 uppercase tracking-wider">Tokens on {selectedChain.name}</p>
        <div className="flex gap-8 text-[11px] text-white/20 uppercase tracking-wider">
          <span className="w-20 text-right">Balance</span>
          <span className="w-20 text-right">Value</span>
          <span className="w-20 text-right">Price</span>
          <span className="w-16 text-right">24h</span>
        </div>
      </div>
      <div className="divide-y divide-border3/30">
        {!address ? (
          <div className="px-5 py-6 text-center">
            <p className="text-[13px] text-white/40">Connect wallet to view balances</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-[13px] text-white/40">No supported tokens on this network</p>
          </div>
        ) : (
          tokens.map((item) => {
            const balanceEntry = balances.find((b) => b.token.symbol === item.symbol);
            const balance = balanceEntry?.balance;
            const priceData = getPrice(item.symbol);

            const balanceNum = balance ? parseFloat(balance.replace(',', '')) : 0;
            const usdValue = priceData ? balanceNum * priceData.price : 0;
            const change24h = priceData?.percentChange24h ?? 0;

            return (
              <div key={item.symbol} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 min-w-[140px]">
                  {item.logo ? (
                    <img src={item.logo} alt={item.symbol} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[10px] text-white/40 font-medium">{item.symbol.slice(0, 3)}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-medium text-white/80">{item.symbol}</p>
                    <p className="text-[11px] text-white/30">{item.name}</p>
                  </div>
                </div>
                <div className="flex gap-8 items-center">
                  <span className="w-20 text-right text-[13px] font-medium text-white/60">
                    {balance !== null && balance !== undefined ? `${balance}` : '—'}
                  </span>
                  <span className="w-20 text-right text-[12px] text-white/40">
                    {formatUSD(usdValue)}
                  </span>
                  <span className="w-20 text-right text-[12px] text-white/40">
                    {formatPrice(priceData?.price ?? 0)}
                  </span>
                  <span className={`w-16 text-right text-[12px] font-medium ${change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {priceData ? `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%` : '—'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
