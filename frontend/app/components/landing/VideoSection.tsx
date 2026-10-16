'use client';

import Section from './Section';

export default function VideoSection() {
  return (
    <section className="py-24 grid-bg scroll-mt-14 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] top-1/2 -translate-y-1/2 -left-40 rounded-full blur-[100px] opacity-30 bg-accent pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] top-1/2 -translate-y-1/2 -right-32 rounded-full blur-[100px] opacity-30 bg-arcpurple pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6">
        <Section>
          <p className="text-[13px] text-accent uppercase tracking-wider text-center mb-4">Demo</p>
        </Section>

        <Section>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center tracking-tight mb-12">
            See Wayfind in action
          </h2>
        </Section>

        <div className="relative rounded-2xl overflow-hidden border border-border3 bg-black/30">
          <iframe
            src="https://www.youtube.com/embed/Lqn_t6TYxv4"
            title="Wayfind Arc Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          />
        </div>
      </div>
    </section>
  );
}
