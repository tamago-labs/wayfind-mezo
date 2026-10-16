import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TOKENS } from '@/lib/tokens';
import TokenDetailClient from '@/components/dashboard/token-detail/TokenDetailClient';

export function generateStaticParams() {
  return TOKENS.map((t) => ({ symbol: t.symbol }));
}

export default async function TokenDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const token = TOKENS.find((t) => t.symbol === symbol);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-white/40 text-lg">Token not found</p>
          <Link href="/dashboard/explore" className="text-accent text-sm mt-2 inline-block hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/dashboard/explore" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Explore
        </Link>
      </nav>
      <TokenDetailClient token={token} />
    </div>
  );
}
