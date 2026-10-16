import { NextResponse } from 'next/server';
import { getCoingeckoIds } from '@/lib/tokens';

export async function GET() {
  const ids = getCoingeckoIds();

  if (!ids) {
    return NextResponse.json({});
  }

  try {
    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", ids);
    url.searchParams.set("price_change_percentage", "1h,24h,7d,30d");

    const res = await fetch(url.toString());

    if (!res.ok) {
      const text = await res.text();
      console.error('[crypto-prices] CoinGecko error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch prices', status: res.status }, { status: res.status });
    }

    const data = await res.json();

    const priceMap: Record<string, any> = {};
    for (const coin of data) {
      priceMap[coin.symbol.toUpperCase()] = {
        price: coin.current_price ?? 0,
        marketCap: coin.market_cap ?? 0,
        volume24h: coin.total_volume ?? 0,
        percentChange1h: coin.price_change_percentage_1h_in_currency ?? 0,
        percentChange24h: coin.price_change_percentage_24h_in_currency ?? 0,
        percentChange7d: coin.price_change_percentage_7d_in_currency ?? 0,
        percentChange30d: coin.price_change_percentage_30d_in_currency ?? 0,
        circulatingSupply: coin.circulating_supply ?? 0,
        totalSupply: coin.total_supply ?? 0,
        maxSupply: coin.max_supply ?? null,
        lastUpdated: coin.last_updated ?? '',
      };
    }

    return NextResponse.json(priceMap);
  } catch (err) {
    console.error('[crypto-prices] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
