'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrice } from '@/contexts/PriceContext';
import { useEarn } from '@/contexts/EarnContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { TOKENS } from '@/lib/tokens';

type SortKey = 'symbol' | 'name' | 'price' | 'percentChange24h' | 'percentChange7d' | 'percentChange30d' | 'marketCap' | 'volume24h';
type SortDir = 'asc' | 'desc';

function usePageSize(rowHeight = 48, offset = 220) {
  const [size, setSize] = useState(20);
  useEffect(() => {
    function calc() {
      const available = window.innerHeight - offset;
      const rows = Math.floor(available / rowHeight);
      setSize(Math.max(15, rows));
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [rowHeight, offset]);
  return size;
}

function formatPrice(price: number): string {
  if (price === 0) return '—';
  if (price < 1) return '$' + price.toFixed(6);
  if (price < 1000) return '$' + price.toFixed(2);
  return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatLarge(value: number): string {
  if (value === 0) return '—';
  if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return '$' + (value / 1e3).toFixed(1) + 'K';
  return '$' + value.toFixed(2);
}

function formatChange(value: number | null): string {
  if (value == null) return '—';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export default function ExplorePage() {
  const router = useRouter();
  const { getPrice, loading: priceLoading } = usePrice();
  const { getBestApy } = useEarn();
  const { getBestBorrowApy } = useBorrow();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('volume24h');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const pageSize = usePageSize();

  const rows = useMemo(() => {
    return TOKENS.map((token) => {
      const price = getPrice(token.symbol);
      return {
        symbol: token.symbol,
        name: token.name,
        logo: token.logo,
        price: price?.price ?? null,

        percentChange24h: price?.percentChange24h ?? null,
        percentChange7d: price?.percentChange7d ?? null,
        percentChange30d: price?.percentChange30d ?? null,
        marketCap: price?.marketCap ?? null,
        volume24h: price?.volume24h ?? null,
      };
    });
  }, [getPrice]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.symbol?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronUp className="w-3 h-3 text-white/10" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-accent" />
    ) : (
      <ChevronDown className="w-3 h-3 text-accent" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by symbol or name…"
            className="w-full bg-surface border border-border3 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface border border-border3/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border3/50 text-[11px] text-white/30 font-medium uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium normal-case">
                  <button onClick={() => handleSort('symbol')} className="flex items-center gap-1 hover:text-white/50 transition-colors">
                    Token <SortIcon column="symbol" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <span className="text-white/30 normal-case">Earn%</span>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <span className="text-white/30 normal-case">Borrow%</span>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <button onClick={() => handleSort('price')} className="flex items-center gap-1 justify-end w-full hover:text-white/50 transition-colors">
                    Price <SortIcon column="price" />
                  </button>
                </th>

                <th className="text-right px-4 py-3 font-medium">
                  <button onClick={() => handleSort('percentChange24h')} className="flex items-center gap-1 justify-end w-full hover:text-white/50 transition-colors">
                    24h% <SortIcon column="percentChange24h" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <button onClick={() => handleSort('percentChange7d')} className="flex items-center gap-1 justify-end w-full hover:text-white/50 transition-colors">
                    7d% <SortIcon column="percentChange7d" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <button onClick={() => handleSort('percentChange30d')} className="flex items-center gap-1 justify-end w-full hover:text-white/50 transition-colors">
                    30d% <SortIcon column="percentChange30d" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <button onClick={() => handleSort('marketCap')} className="flex items-center gap-1 justify-end w-full hover:text-white/50 transition-colors">
                    Market Cap <SortIcon column="marketCap" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  <button onClick={() => handleSort('volume24h')} className="flex items-center gap-1 justify-end w-full hover:text-white/50 transition-colors">
                    Volume <SortIcon column="volume24h" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.symbol} className="border-b border-border3/20 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/token/${row.symbol}`)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {row.logo ? (
                        <img src={row.logo} alt="" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white/40">
                          {row.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <span className="font-mono font-semibold text-white/90">{row.symbol}</span>
                        <p className="text-[11px] text-white/30">{row.name}</p>
                      </div>
                    </div>
                  </td>
                      <td className="px-4 py-3 text-right text-white/60 font-medium">
                    {(() => {
                      const apy = getBestApy(row.symbol);
                      return apy != null ? `${(apy * 100).toFixed(2)}%` : '—';
                    })()}
                  </td>
                  <td className="px-4 py-3 text-right text-white/60 font-medium">
                    {(() => {
                      const borrowApy = getBestBorrowApy(row.symbol);
                      return borrowApy != null ? `${(borrowApy * 100).toFixed(2)}%` : '—';
                    })()}
                  </td>
                  <td className="px-4 py-3 text-right text-white/70">
                    {row.price != null ? formatPrice(row.price) : '—'}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${row.percentChange24h != null ? row.percentChange24h >= 0 ? 'text-emerald-400' : 'text-red-400' : 'text-white/30'}`}>
                    {formatChange(row.percentChange24h)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${row.percentChange7d != null ? row.percentChange7d >= 0 ? 'text-emerald-400' : 'text-red-400' : 'text-white/30'}`}>
                    {formatChange(row.percentChange7d)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${row.percentChange30d != null ? row.percentChange30d >= 0 ? 'text-emerald-400' : 'text-red-400' : 'text-white/30'}`}>
                    {formatChange(row.percentChange30d)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/40">
                    {formatLarge(row.marketCap ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/40">
                    {formatLarge(row.volume24h ?? 0)}
                  </td>
                </tr>
              ))}
              {!priceLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-white/30">No tokens found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border3/50">
            <p className="text-[12px] text-white/30">
              Page {page} of {totalPages} ({sorted.length} tokens)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[12px] text-white/50 px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
