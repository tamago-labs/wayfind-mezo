'use client';

import { Download } from 'lucide-react';

export default function TemplateCards() {
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-lg rounded-2xl border border-border3 bg-white/[0.03] overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-arcblue to-arcpurple" />

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/39727.png"
                alt="Mezo"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-display font-semibold text-white text-sm">Wayfind Mezo</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">v1.0</span>
            </div>
            <a
              href="https://x.ai/bot/IX2bDYMLKqQhe1hYFnXdi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-arcblue to-arcpurple hover:opacity-90 transition-opacity shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </a>
          </div>

          <ul className="space-y-2 text-[12px] text-white/50">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent2" />
              Manage BTC-backed loans
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent2" />
              Monitor collateral health
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent2" />
              Automate Bitcoin finance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
