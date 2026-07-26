"use client";

import { motion } from "framer-motion";
import { site } from "@/content/ru";

export default function Hero() {
  const { hero } = site;

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlays for legibility + mood */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/75 via-transparent to-transparent" />
        <div className="absolute -top-40 left-1/4 h-[55vh] w-[55vh] rounded-full bg-accent/15 blur-[130px]" />
      </div>

      <div className="container-px relative z-10 w-full pb-16 pt-32 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-accent-soft"
        >
          <span className="h-px w-8 bg-accent" />
          {hero.eyebrow}
        </motion.p>

        <h1 className="max-w-5xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl">
          {hero.titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-lg text-muted md:text-xl"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
          >
            {hero.ctaPrimary}
          </a>
          <a
            href="#cases"
            className="rounded-full border border-line px-7 py-3.5 text-sm text-fg transition-colors hover:border-fg/40"
          >
            {hero.ctaSecondary}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-10 sm:grid-cols-4"
        >
          {hero.stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl text-fg md:text-4xl">{s.value}</dt>
              <dd className="mt-1 text-sm text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
