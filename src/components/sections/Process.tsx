import { site } from "@/content/ru";
import { Reveal } from "@/components/ui/Reveal";

export default function Process() {
  const { process } = site;

  return (
    <section id="process" className="py-24 md:py-32">
      <div className="container-px">
        <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">{process.eyebrow}</p>
        <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl">{process.title}</h2>

        <div className="mt-16 border-t border-line">
          {process.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05}>
              <div className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-line py-8 transition-colors hover:bg-bg-soft md:grid-cols-[6rem_1fr_2fr] md:gap-10 md:py-10">
                <span className="font-display text-2xl text-accent md:text-3xl">{step.n}</span>
                <h3 className="text-2xl md:text-3xl">{step.title}</h3>
                <p className="col-span-2 text-muted md:col-span-1 md:max-w-md md:justify-self-end">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
