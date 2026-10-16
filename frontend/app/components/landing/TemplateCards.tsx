'use client';

import { Download, ExternalLink } from 'lucide-react';

const templates = [
  {
    chain: 'Arc',
    version: 'v1.0',
    description: 'Need setup help? Just ask your bot.',
    available: true,
    logo: 'https://icons.llamao.fi/icons/chains/rsz_arc?w=48&h=48',
    downloadUrl: 'https://x.ai/bot/IX2bDYMLKqQhe1hYFnXdi',
  },
  {
    chain: 'Solana',
    version: 'Available Now',
    description: 'Already live — get the Solana template',
    available: false,
    live: true,
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    downloadUrl: 'https://wayfind.click',
  },
];

export default function TemplateCards() {
  return (
    <div className="flex flex-col gap-3">
      {templates.map((t) => (
        <div
          key={t.chain}
          className="relative rounded-xl border border-border3 bg-white/[0.03] p-4 flex items-center gap-5"
        >
          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-arcblue to-arcpurple" />

          <div className="flex items-center gap-3 min-w-[160px]">
            <img src={t.logo} alt={t.chain} className="w-8 h-8 rounded-full" />
            <span className="font-display font-semibold text-white text-sm">{t.chain}</span>
            <span className="text-[10px] text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-full hidden md:inline">{t.version}</span>
          </div>

          <p className="text-[12px] text-white/40 leading-relaxed flex-1 hidden md:block">
            {t.description}
          </p>

          {t.available ? (
            <a
              href={t.downloadUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-arcblue to-arcpurple hover:opacity-90 transition-opacity shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          ) : t.live ? (
            <a
              href={t.downloadUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-lg bg-white/[0.06] border border-border3/40 hover:border-white/20 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Navigate
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 text-white/30 text-xs font-semibold px-5 py-2.5 rounded-lg bg-white/[0.06] border border-border3/40 cursor-not-allowed shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Coming Soon
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
