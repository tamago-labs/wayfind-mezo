'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/showcases', label: 'Showcases' },
  { href: '/templates', label: 'Templates' },
  { href: '/tools', label: 'Tools' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-2 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-arcblue to-arcpurple flex">
              <span className="text-[20px] font-brand text-center mx-auto rotate-[-10deg] ml-[5px] mt-[1px]">W</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Wayfind</span>
          </Link>

          <nav className="hidden md:flex font-display items-center gap-7 text-[13px] text-white/50 font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-[13px] font-display font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors" disabled>
            Connect Wallet
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60 hover:text-white transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border3/50 bg-surface px-6 py-4 space-y-3 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-[14px] text-white/50 hover:text-white font-display font-medium transition-colors">{link.label}</Link>
            ))}
            <button className="block w-full mt-4 text-center text-[13px] font-display font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors" disabled>
              Connect Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
