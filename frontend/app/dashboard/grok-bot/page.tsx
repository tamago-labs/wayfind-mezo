export default function GrokBotPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] relative flex items-center justify-center">
      <div className="absolute w-[400px] h-[400px] top-1/2 -translate-y-1/2 -left-40 rounded-full blur-[100px] opacity-30 bg-accent pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] top-1/2 -translate-y-1/2 -right-32 rounded-full blur-[100px] opacity-30 bg-arcpurple pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center -mt-20">
        <p className="text-[16px] text-white/50 leading-relaxed mb-10">
          Import a Wayfind template into Grok Bot to give it wallet operations, cross-chain USDC, token swaps, and earn vault management on Arc.
        </p>

        <a
          href="https://x.ai/bot/IX2bDYMLKqQhe1hYFnXdi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[15px] font-display font-medium bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors mb-12"
        >
          Import Template
        </a>

        <div className="bg-surface border border-border3/50 rounded-xl p-5 text-left max-w-sm mx-auto">
          <p className="text-[13px] text-white/40 mb-3">Set these in your bot environment:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <code className="text-[12px] text-accent font-mono">ARC_PRIVATE_KEY</code>
              <span className="text-[12px] text-white/30">Your Arc wallet private key</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="text-[12px] text-accent font-mono">ARC_CHAIN</code>
              <span className="text-[12px] text-white/30">mainnet or testnet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
