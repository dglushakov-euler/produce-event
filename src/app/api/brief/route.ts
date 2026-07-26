import { NextResponse } from "next/server";
import { sendLeadAutoReply } from "@/lib/email";

// Lead form → Telegram bot.
// Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local (see .env.example).

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[brief] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const field = (k: string, max = 500) => String(data[k] ?? "").trim().slice(0, max);

  const name = field("name", 120);
  const email = field("email", 200);
  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const rows: [string, string][] = [
    ["Имя", name],
    ["Компания", field("company", 200)],
    ["Email", email],
    ["Телефон", field("phone", 50)],
    ["Тип события", field("eventType", 100)],
    ["Бюджет", field("budget", 100)],
    ["Сообщение", field("message", 1500)],
  ];

  const text =
    "🥂 <b>Новая заявка с сайта Produce Event</b>\n\n" +
    rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<b>${k}:</b> ${esc(v)}`)
      .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[brief] Telegram API error:", res.status, body);
      return NextResponse.json({ ok: false, error: "telegram_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[brief] Telegram request failed:", err);
    return NextResponse.json({ ok: false, error: "telegram_unreachable" }, { status: 502 });
  }

  // Auto-reply to the client. Never blocks the lead: Telegram already succeeded.
  try {
    await sendLeadAutoReply(email, name);
  } catch (err) {
    console.error("[brief] auto-reply email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
