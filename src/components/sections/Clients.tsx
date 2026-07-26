import { site } from "@/content/ru";
import { Reveal } from "@/components/ui/Reveal";

export default function Clients() {
  const { clients } = site;
  const logos = [...clients.logos, ...clients.logos];

  return (
    <section className="border-y border-line bg-bg-soft py-24 md:py-32">
      <p className="container-px text-xs uppercase tracking-[0.25em] text-accent-soft">
        {clients.eyebrow}
      </p>

      {/* Logo marquee */}
      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 pr-16">
          {logos.map((logo, i) => (
            <span
              key={i}
              className="font-display text-2xl text-fg/40 transition-colors hover:text-fg md:text-3xl"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="container-px mt-20 grid gap-6 md:grid-cols-2">
        {clients.testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-bg p-8 md:p-10">
              <blockquote className="font-display text-xl leading-relaxed text-fg md:text-2xl">
                «{t.quote}»
              </blockquote>
              <figcaption className="mt-8 text-sm text-muted">
                <span className="text-fg">{t.author}</span> — {t.company}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
