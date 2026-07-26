import { site } from "@/content/ru";
import { Reveal } from "@/components/ui/Reveal";

export default function Cases() {
  const { cases } = site;

  return (
    <section id="cases" className="py-24 md:py-32">
      <div className="container-px">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">{cases.eyebrow}</p>
            <h2 className="mt-4 text-4xl md:text-5xl">{cases.title}</h2>
          </div>
          <p className="max-w-xs text-sm text-muted">{cases.note}</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {cases.items.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.1}>
              <article className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden"
                  style={{ background: `linear-gradient(145deg, ${c.from}, ${c.to})` }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(198,161,91,0.18),transparent_55%)] transition-opacity duration-700 group-hover:opacity-0" />
                  <span className="absolute right-5 top-5 rounded-full border border-line bg-bg/40 px-3 py-1 text-xs text-fg/80 backdrop-blur-sm">
                    {c.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-7 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 text-sm text-accent-soft">
                      Смотреть кейс <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted">
                      {c.category}
                      {c.loc ? ` · ${c.loc}` : ""}
                    </p>
                    <h3 className="mt-2 text-2xl">{c.title}</h3>
                  </div>
                  <span className="shrink-0 font-display text-lg text-accent-soft">{c.metric}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
