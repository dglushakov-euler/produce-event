// Lead-management Telegram bot for Produce Event.
// Runs as a separate container (long polling — no inbound network needed).
// - Handles status buttons on lead messages (edits the message in place)
// - Reminds about leads that stayed "new" for too long
//
// State is an append-only JSONL file shared with the web container:
//   {type:"lead", id, name, html, ts}      — written by /api/brief
//   {type:"status", id, status, by, ts}    — written here on button press
//   {type:"rem", id, ts}                   — written here after a reminder

const fs = require("fs");
const path = require("path");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;
const FILE = process.env.LEADS_FILE || path.join(process.cwd(), "data", "leads.jsonl");
const REMIND_AFTER_H = Number(process.env.REMIND_AFTER_HOURS || 2);

if (!TOKEN || !CHAT) {
  console.error("[bot] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set");
  process.exit(1);
}
fs.mkdirSync(path.dirname(FILE), { recursive: true });

const STATUSES = {
  work: { label: "В работе", emoji: "🟢" },
  kp: { label: "КП отправлено", emoji: "📨" },
  deal: { label: "Сделка!", emoji: "🥂" },
  lost: { label: "Отказ", emoji: "⚪" },
};

const KEYBOARD = {
  inline_keyboard: [
    [{ text: "🟢 Взять в работу", callback_data: "st:work" }],
    [
      { text: "📨 КП", callback_data: "st:kp" },
      { text: "🥂 Сделка", callback_data: "st:deal" },
      { text: "⚪ Отказ", callback_data: "st:lost" },
    ],
  ],
};

async function api(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function readState() {
  const leads = new Map();
  if (!fs.existsSync(FILE)) return leads;
  for (const line of fs.readFileSync(FILE, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.type === "lead") leads.set(e.id, { ...e, status: "new", reminded: false });
    const l = leads.get(e.id);
    if (!l) continue;
    if (e.type === "status") l.status = e.status;
    if (e.type === "rem") l.reminded = true;
  }
  return leads;
}

const append = (obj) => fs.appendFileSync(FILE, JSON.stringify(obj) + "\n");

const msk = (ts) =>
  new Date(ts).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });

async function onCallback(q) {
  const st = (q.data || "").split(":")[1];
  const info = STATUSES[st];
  const msgId = q.message?.message_id;
  if (!info || !msgId) return api("answerCallbackQuery", { callback_query_id: q.id });

  const leads = readState();
  const lead = leads.get(msgId);
  const by = q.from?.first_name || "кто-то";
  const statusLine = `➤ ${info.emoji} <b>${info.label}</b> — ${by}, ${msk(Date.now())}`;

  // Original HTML is stored in the lead record; fall back to plain text.
  const baseHtml = lead?.html || (q.message.text || "").split("\n➤")[0];

  await api("editMessageText", {
    chat_id: q.message.chat.id,
    message_id: msgId,
    text: `${baseHtml}\n\n${statusLine}`,
    parse_mode: "HTML",
    reply_markup: KEYBOARD,
  });
  append({ type: "status", id: msgId, status: st, by, ts: Date.now() });
  await api("answerCallbackQuery", { callback_query_id: q.id, text: `${info.emoji} ${info.label}` });
}

async function checkReminders() {
  try {
    const now = Date.now();
    for (const [id, l] of readState()) {
      if (l.status !== "new" || l.reminded) continue;
      const hours = (now - l.ts) / 3600_000;
      if (hours < REMIND_AFTER_H) continue;
      await api("sendMessage", {
        chat_id: CHAT,
        text: `⏰ Заявка от <b>${l.name || "клиента"}</b> ждёт ответа уже ${Math.floor(hours)} ч. Не потеряли?`,
        parse_mode: "HTML",
        reply_to_message_id: id,
      });
      append({ type: "rem", id, ts: now });
    }
  } catch (e) {
    console.error("[bot] reminder check failed:", e.message);
  }
}

async function main() {
  console.log("[bot] started, leads file:", FILE);
  setInterval(checkReminders, 10 * 60_000);
  checkReminders();

  let offset = 0;
  while (true) {
    try {
      const r = await api("getUpdates", {
        offset,
        timeout: 50,
        allowed_updates: ["callback_query"],
      });
      for (const u of r.result || []) {
        offset = u.update_id + 1;
        if (u.callback_query) await onCallback(u.callback_query).catch((e) => console.error("[bot] callback failed:", e.message));
      }
    } catch (e) {
      console.error("[bot] poll error:", e.message);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

main();
