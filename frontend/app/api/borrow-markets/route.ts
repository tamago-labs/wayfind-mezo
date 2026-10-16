import { NextResponse } from 'next/server';
import { createBorrowKitContext, exploreMarkets } from '@circle-fin/borrow-kit';

export async function GET() {
  try {
    const context = createBorrowKitContext();
    const result = await exploreMarkets(context, {
      chain: 'Arc',
      sortBy: 'borrowApy',
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('[borrow-markets] error:', err);
    return NextResponse.json({ error: 'Failed to fetch borrow markets' }, { status: 500 });
  }
}
