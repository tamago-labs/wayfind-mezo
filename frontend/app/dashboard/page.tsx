'use client';

import { ArrowUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] relative flex items-center justify-center">
      <div className="absolute w-[400px] h-[400px] top-1/2 -translate-y-1/2 -left-40 rounded-full blur-[100px] opacity-30 bg-accent pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] top-1/2 -translate-y-1/2 -right-32 rounded-full blur-[100px] opacity-30 bg-arcpurple pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 -mt-20">
        <div className="text-center mb-10">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-white/70 tracking-tight">
            What can I help you with?
          </h1>
        </div>

        <div className="relative rounded-2xl border border-border3 bg-surface shadow-2xl">
          <textarea
            placeholder="Ask Wayfind anything about your portfolio…"
            className="w-full min-h-[60px] bg-transparent px-5 pt-5 pb-14 text-[14px] text-white/80 placeholder:text-white/25 resize-none focus:outline-none"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <p className="text-center text-[12px] text-accent mt-4">
          The platform AI is no longer available. Try using it in your Grok Bot.
        </p>
      </div>
    </div>
  );
}
