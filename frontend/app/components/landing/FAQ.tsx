'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';

const faqs = [
  { q: 'What is Wayfind Arc?', a: 'A Grok Bot template that combines an MCP server, agent skills, and pre-defined memory to give your bot full control over Arc wallet operations, Unified Balance (deposit/spend cross-chain), token swaps, and earn vault management.' },
  { q: 'How do I set it up on Grok Bot?', a: 'Download a bot template from the link above, then ask the bot to set it up. It will guide you through connecting your wallet and configuring the environment.' },
  { q: 'Which chains are supported?', a: 'Arc Mainnet and Testnet. Unified Balance supports cross-chain transfers to Ethereum, Base, Arbitrum, Avalanche, Polygon, Optimism, and more.' },
  { q: 'Is my private key safe?', a: 'Your private key stays on your bot\'s computer. It is never shared, logged, or sent to any server. Anyone with access to that machine can move funds, so keep your bot environment secure.' },
  { q: 'What tokens are supported?', a: 'USDC (native gas), EURC, cirBTC, and WETH. Tokens are resolved by symbol — no need to remember contract addresses.' },
  { q: 'How does cross-chain spend work?', a: 'Deposit USDC into Unified Balance, then spend to any supported chain. The SDK burns USDC on the source chain and mints on the destination via Circle Gateway.' },
  { q: 'What are earn vaults?', a: 'Earn vaults let you deposit tokens to earn yield. List available vaults with APY, deposit, track your position, and withdraw when ready.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Section>
          <div className="text-center mb-12">
            <p className="text-[13px] text-accent uppercase tracking-wider text-center mb-4">FAQ</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
        </Section>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Section key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-surface rounded-xl border border-border3/50 hover:border-border3 transition-colors text-left"
              >
                <span className="text-[14px] font-medium text-white/80">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-white/40" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 pt-2 text-[13px] text-white/45 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          ))}
        </div>
      </div>
    </section>
  );
}
