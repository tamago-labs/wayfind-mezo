'use client';

import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

const templates = [
  {
    name: 'Wayfind Mezo',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/39727.png',
    version: 'v1.0',
    url: 'https://x.ai/bot/IX2bDYMLKqQhe1hYFnXdi',
  },
  {
    name: 'Wayfind Arc',
    icon: 'https://icons.llamao.fi/icons/chains/rsz_arc?w=48&h=48',
    version: 'v1.0',
    url: 'https://x.ai/bot/IX2bDYMLKqQhe1hYFnXdi',
  },
  {
    name: 'Solana Tokenized Stocks',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    version: 'v1.0',
    url: 'https://x.ai/bot/EpQzEq9pQvX_utfgsxzbj',
  },
];

export default function TemplateCards() {
  const [index, setIndex] = useState(0);
  const t = templates[index];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + templates.length) % templates.length)}
          className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative w-full w-lg rounded-2xl border border-border3 bg-white/[0.03] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-arcblue to-arcpurple" />

          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={t.icon} alt={t.name} className="w-10 h-10 rounded-full" />
                <span className="font-display font-semibold text-white text-sm">{t.name}</span>
                <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">{t.version}</span>
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-arcblue to-arcpurple hover:opacity-90 transition-opacity shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Download Now
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIndex((i) => (i + 1) % templates.length)}
          className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
        {templates.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
