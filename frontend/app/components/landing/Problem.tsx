'use client';

import Section from './Section';

export default function Problem() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2">
            <Section>
              <p className="text-[13px] text-accent uppercase tracking-wider mb-6">The Problem</p>
            </Section>
            <Section>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Grok Bot Comes with Always-On, But Isn't Ready for Onchain Finance
              </h2>
            </Section>
          </div>

          <div className="md:col-span-3">
            <Section>
              <p className="text-[15px] text-white/50 leading-relaxed">
                Grok Bot lives on a dedicated computer, always ready. What it doesn't have is access to protocol data, blockchain context, and the tools to <span className="text-accent font-semibold">transact onchain</span>.
              </p>
            </Section>

            <Section>
              <p className="mt-6 text-lg md:text-xl font-display font-semibold text-white/80 leading-snug">
                AI can run around the clock. But onchain awareness has been missing — until now.
              </p>
            </Section>

            <Section>
              <p className="mt-6 text-[15px] text-white/50 leading-relaxed">
                Wayfind gives Grok Bot the data and tools to <span className="text-accent font-semibold">operate on Arc</span> — from querying protocols and swapping assets to earning yield and automating payroll, all through your <span className="text-accent font-semibold">AI teammate</span>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </section>
  );
}
