import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import HowItWorks from '@/components/landing/HowItWorks';
import CTA from '@/components/landing/CTA';
import VideoSection from '@/components/landing/VideoSection';
import FAQ from '@/components/landing/FAQ';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden pt-14">
      <div className="absolute w-[350px] h-[350px] -top-32 -left-32 rounded-full blur-[80px] opacity-40 bg-accent pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bottom-40 left-1/4 rounded-full blur-[80px] opacity-40 bg-accent pointer-events-none" />

      <section className="relative z-10">
        <Hero />
      </section>

      <Problem />
      <HowItWorks />
      <VideoSection />
      <FAQ />
      <CTA />
    </main>
  );
}
