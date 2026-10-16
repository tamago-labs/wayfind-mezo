'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { TOKENS } from '@/lib/tokens';
import type { PriceData } from '@/lib/price-types';

interface PriceContextValue {
  getPrice: (symbol: string) => PriceData | null;
  loading: boolean;
}

const PriceContext = createContext<PriceContextValue>({
  getPrice: () => null,
  loading: true,
});

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [priceMap, setPriceMap] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch('/api/crypto-prices')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          console.log("data:", data)
          setPriceMap(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getPrice = useCallback(
    (symbol: string): PriceData | null => {
      const key = Object.keys(priceMap).find((k) => k.toLowerCase() === symbol.toLowerCase());
      return key ? priceMap[key] : null;
    },
    [priceMap]
  );

  return (
    <PriceContext.Provider value={{ getPrice, loading }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  return useContext(PriceContext);
}
