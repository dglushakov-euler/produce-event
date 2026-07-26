"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/content/ru";

export default function Manifest() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.78"],
  });

  const words = site.manifest.text.split(" ");

  return (
    <section className="container-px py-28 md:py-40" ref={ref}>
      <p className="mb-10 text-xs uppercase tracking-[0.25em] text-accent-soft">
        {site.manifest.eyebrow}
      </p>
      <p className="max-w-5xl font-display text-3xl leading-snug sm:text-4xl md:text-5xl">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <Word key={i} progress={scrollYProgress} range={[start, end]} word={word} />;
        })}
      </p>
    </section>
  );
}

function Word({
  progress,
  range,
  word,
}: {
  progress: import("framer-motion").MotionValue<number>;
  range: [number, number];
  word: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{word}</motion.span>
    </span>
  );
}
