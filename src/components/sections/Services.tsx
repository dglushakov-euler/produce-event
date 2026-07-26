import { site } from "@/content/ru";
import { Reveal } from "@/components/ui/Reveal";

export default function Services() {
  const { services } = site;

  return (
    <section id="services" className="border-t border-line bg-bg-soft py-24 md:py-32">
      <div className="container-px">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">{services.eyebrow}</p>
            <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl">{services.title}</h2>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, i) => (
            <Reveal key={item.n} delay={(i % 3) * 0.08}>
              <article className="group h-full bg-bg-soft p-8 transition-colors duration-500 hover:bg-surface md:p-10">
                <span className="font-display text-sm text-accent">{item.n}</span>
                <h3 className="mt-6 text-2xl">{item.title}</h3>
                <p className="mt-3 text-muted">{item.text}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm text-fg/0 transition-colors duration-300 group-hover:text-accent-soft">
                  Подробнее
                  <span aria-hidden>→</span>
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
