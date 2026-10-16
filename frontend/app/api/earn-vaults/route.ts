import { NextResponse } from 'next/server';
import { createEarnKitContext, exploreVaults } from '@circle-fin/earn-kit';

export async function GET(request: Request) {
  const chainParam = new URL(request.url).searchParams.get('chain');
  const chain = chainParam === 'testnet' ? 'Arc_Testnet' : 'Arc';

  try {
    const context = createEarnKitContext();
    const result = await exploreVaults(context, {
      chain,
      sortBy: 'apy',
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('[earn-vaults] error:', err);
    return NextResponse.json({ error: 'Failed to fetch vaults' }, { status: 500 });
  }
}
