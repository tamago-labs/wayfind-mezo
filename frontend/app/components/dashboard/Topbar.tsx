'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'New Chat',
  '/dashboard/portfolio': 'Portfolio',
  '/dashboard/explore': 'Explore',
  '/dashboard/grok-bot': 'Use in Grok Bot',
  '/dashboard/chats': 'Saved Chats',
};

export default function Topbar() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  return (
    <header className="h-14 sticky top-0 z-20 bg-dark/80 backdrop-blur border-b border-border3/50 flex items-center justify-between px-6">
      <p className="font-display text-sm font-semibold text-white/70">{pageTitle}</p>
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-accent text-white hover:bg-accent/80 transition-colors"
        disabled
      >
        Connect Wallet
      </button>
    </header>
  );
}
