import { site } from "@/content/ru";

export default function Footer() {
  return (
    <footer className="relative z-[2] border-t border-line bg-bg-soft">
      <div className="container-px py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="font-display text-2xl">
              {site.brand}
              <span className="text-accent">.</span>
            </div>
            <p className="mt-4 text-muted">{site.footer.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted">Навигация</div>
              <ul className="mt-4 space-y-2">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-sm text-fg/80 transition-colors hover:text-accent">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted">Контакты</div>
              <ul className="mt-4 space-y-2 text-sm text-fg/80">
                <li>
                  <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-accent">
                    {site.contact.email}
                  </a>
                </li>
                <li>{site.contact.phone}</li>
                <li>{site.contact.address}</li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted">Соцсети</div>
              <ul className="mt-4 space-y-2">
                {site.footer.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="text-sm text-fg/80 transition-colors hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.brand}. Все права защищены.</span>
          <span>Политика конфиденциальности · Условия</span>
        </div>
      </div>
    </footer>
  );
}
