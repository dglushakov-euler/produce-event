import { site } from "@/content/ru";
import { Reveal } from "@/components/ui/Reveal";

export default function CtaBand() {
  const { ctaBand } = site;

  return (
    <section className="container-px py-10 md:py-14">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-8 py-12 md:px-14 md:py-16">
          {/* Accent glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />
            <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent/10 blur-[110px]" />
          </div>

          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl leading-tight md:text-4xl">{ctaBand.title}</h2>
              <p className="mt-4 text-muted">{ctaBand.subtitle}</p>
            </div>
            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-8 py-4 font-medium text-bg transition-colors hover:bg-accent-soft"
            >
              {ctaBand.button}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
