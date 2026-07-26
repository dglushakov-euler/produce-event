"use client";

import { useState } from "react";
import { site } from "@/content/ru";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { contact } = site;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="border-t border-line py-24 md:py-32">
      <div className="container-px grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">{contact.eyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-5xl">{contact.title}</h2>
          <p className="mt-6 max-w-md text-lg text-muted">{contact.subtitle}</p>

          <dl className="mt-10 space-y-5">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${contact.email}`} className="text-lg transition-colors hover:text-accent">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted">Телефон</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="text-lg transition-colors hover:text-accent"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted">География</dt>
              <dd className="mt-1 text-lg">{contact.address}</dd>
            </div>
          </dl>
        </div>

        {status === "success" ? (
          <div className="flex min-h-72 flex-col items-start justify-center rounded-2xl border border-accent/30 bg-bg-soft p-10">
            <span className="font-display text-3xl text-accent">Спасибо!</span>
            <p className="mt-4 max-w-sm text-muted">
              Бриф получен. Мы свяжемся с вами в течение одного рабочего дня с идеями и оценкой.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 text-sm text-accent-soft underline-offset-4 hover:underline"
            >
              Отправить ещё один бриф
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-bg-soft p-6 md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Имя" name="name" required placeholder="Как к вам обращаться" />
              <Field label="Компания" name="company" placeholder="Название (опционально)" />
              <Field label="Email" name="email" type="email" required placeholder="you@company.com" />
              <Field label="Телефон" name="phone" placeholder="+7 ..." />

              <Select label="Тип события" name="eventType" options={contact.eventTypes} />
              <Select label="Бюджет" name="budget" options={contact.budgets} />
            </div>

            <div className="mt-5">
              <label className="text-xs uppercase tracking-widest text-muted">Расскажите подробнее</label>
              <textarea
                name="message"
                rows={4}
                placeholder="Формат, дата, количество гостей, пожелания…"
                className="mt-2 w-full resize-none rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent/50"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-7 w-full rounded-full bg-accent px-7 py-4 text-sm font-medium text-bg transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {status === "loading" ? "Отправляем…" : "Отправить бриф"}
            </button>

            {status === "error" && (
              <p className="mt-4 text-sm text-red-400">
                Что-то пошло не так. Напишите нам напрямую на {contact.email}.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent/50"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted">{label}</label>
      <select
        name={name}
        defaultValue=""
        className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-accent/50"
      >
        <option value="" disabled>
          Выберите…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-bg-soft">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
