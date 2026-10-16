'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_CHAINS, type ChainConfig } from '@/lib/chains';

interface NetworkSelectorProps {
  selected: ChainConfig;
  onSelect: (chain: ChainConfig) => void;
}

export default function NetworkSelector({ selected, onSelect }: NetworkSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-border3/50 bg-white/[0.02] text-[13px] text-white/70 hover:border-border3 transition-colors"
      >
        <span>{selected.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border3/50 rounded-xl overflow-hidden z-20 shadow-xl">
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => { onSelect(chain); setOpen(false); }}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-[13px] text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>{chain.name}</span>
              {selected.id === chain.id && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
