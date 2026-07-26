import { site } from "@/content/ru";
import { Reveal } from "@/components/ui/Reveal";

export default function About() {
  const { about } = site;

  return (
    <section id="about" className="border-t border-line bg-bg-soft py-24 md:py-32">
      <div className="container-px grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">{about.eyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-5xl">{about.title}</h2>
          <div className="mt-8 space-y-5 text-lg text-muted">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="flex gap-6 rounded-2xl border border-line bg-bg p-7 transition-colors hover:border-accent/30">
                <span className="font-display text-2xl text-accent">0{i + 1}</span>
                <div>
                  <h3 className="text-xl">{v.title}</h3>
                  <p className="mt-2 text-muted">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
