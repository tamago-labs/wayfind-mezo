'use client';

import Section from './Section';

const steps = [
  {
    num: '01',
    title: 'Download a template',
    description: <>Download a Grok Bot template from <span className="text-white/70 font-medium">wayfind.click</span>. The template opens directly in the Grok Bot app on desktop or mobile.</>,
    example: null,
  },
  {
    num: '02',
    title: 'Set up your bot',
    description: <>Name your bot and ask the bot to <span className="text-white/70 font-medium">start setup</span>. Wallet credentials stay on the bot's computer.</>,
    example: null,
  },
  {
    num: '03',
    title: 'Put your bot to work',
    description: <>Build a bot team. Name a <span className="text-white/70 font-medium">CFO</span> to manage treasury, an <span className="text-white/70 font-medium">HR</span> to run payroll, a <span className="text-white/70 font-medium">Research</span> to track data. They coordinate tasks and execute onchain around the clock.</>,
    example: null,
  },
  {
    num: '04',
    title: 'Use on other platforms',
    description: <>Wayfind works natively with Grok Bot. For other AI tools, use <span className="text-white/70 font-medium">Agent Skills</span> from our GitHub repo or configure <span className="text-white/70 font-medium">MCP</span> on your own.</>,
    example: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 grid-bg scroll-mt-14 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] top-1/2 -translate-y-1/2 -left-40 rounded-full blur-[100px] opacity-30 bg-accent pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] top-1/2 -translate-y-1/2 -right-32 rounded-full blur-[100px] opacity-30 bg-arcpurple pointer-events-none" />
      <div className="max-w-3xl mx-auto px-6">
        <Section>
          <p className="text-[13px] text-accent uppercase tracking-wider text-center mb-4">How it works</p>
        </Section>

        <Section>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center tracking-tight mb-12">
            Your path starts here
          </h2>
        </Section>

        <div className="max-w-lg mx-auto">
          <Section>
            <div className="relative pl-16">
              <div className="absolute left-[18px] top-4 bottom-4 w-px bg-border3" />

              <div className="space-y-10">
                {steps.map((step) => (
                  <div key={step.num} className="relative">
                    <div className="absolute -left-16 top-1 w-9 h-9 flex items-center justify-center">
                      <span className="text-[18px] font-mono text-accent">{step.num}</span>
                    </div>

                    <h3 className="text-[16px] font-semibold mb-1">{step.title}</h3>
                    <p className="text-[14px] text-white/45 leading-relaxed">{step.description}</p>
                    {step.example && (
                      <p className="mt-2 text-[13px] text-accent/70 italic">{step.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </section>
  );
}
