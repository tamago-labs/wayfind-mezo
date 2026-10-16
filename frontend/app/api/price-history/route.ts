import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const coingeckoId = request.nextUrl.searchParams.get('coingeckoId');
  const days = request.nextUrl.searchParams.get('days') || '30';

  if (!coingeckoId) {
    return NextResponse.json({ error: 'coingeckoId required' }, { status: 400 });
  }

  try {
    const url = new URL(`https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart`);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("days", days);

    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json({ error: `CoinGecko HTTP ${res.status}` }, { status: res.status });
    }

    const json = await res.json();

    const prices = (json.prices || []).map(([time, price]: [number, number]) => ({
      time: Math.floor(time / 1000),
      price,
    }));

    return NextResponse.json({ data: prices });
  } catch (err) {
    console.error("[price-history] error:", err);
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 });
  }
}
