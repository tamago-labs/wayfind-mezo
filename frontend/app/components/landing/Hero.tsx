'use client';

import Section from './Section';
import TemplateCards from './TemplateCards';

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-24 relative grid-bg">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative flex flex-col items-center text-center">
        <Section className="max-w-2xl">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            Turn Grok Bot into an<br />
            <span className="bg-gradient-to-r from-arcblue via-accent to-accent2 bg-clip-text text-transparent">
              Onchain Operator
            </span>
          </h1>
        </Section>

        <Section className="max-w-2xl">
          <p className="mt-5 text-[11px] sm:text-[15px] text-white/50 leading-relaxed">
            Download bot templates that help <span className="text-accent font-semibold">Grok Bot</span> access onchain data, execute transactions, and automate financial operations across <span className="text-accent font-semibold">Arc</span> applications.
          </p>
        </Section>

        <Section className="w-full max-w-3xl mx-auto mt-5">
          <TemplateCards />
        </Section>

        <Section>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-white/35">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent2" />
              <span className="flex items-center gap-1 text-[13px] text-white/35">
                One-Click Import for <img src="/grok-bot-circle-neutral-blue.png" alt="Arc" className="w-4 h-4 inline-block rounded-full" /> <img src="/grok-bot-circle-neutral-turquoise.png" alt="Solana" className="w-4 h-4 inline-block rounded-full -ml-2.5" /> <img src="/grok-bot-circle-neutral-orange.png" alt="Grok Bot" className="w-4 h-4 inline-block rounded-full -ml-2.5" /> <span className="text-accent font-semibold">Grok Bot</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent2" />
              <span className="flex items-center gap-1 text-[13px] text-white/35">
                Send &amp; Receive <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" alt="USDC" className="w-4 h-4 inline-block rounded-full" /> <span className="text-accent font-semibold">Across 10+ Chains</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent2" />
               Earn &amp; Borrow on <img src="https://icons.llamao.fi/icons/chains/rsz_arc?w=48&h=48" alt="Arc" className="w-4 h-4 inline-block rounded-full" /> <span className="text-accent font-semibold">Arc</span>
            </li>
          </ul>
        </Section>
      </div>
    </section>
  );
}
