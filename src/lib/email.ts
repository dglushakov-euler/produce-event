import nodemailer from "nodemailer";
import path from "path";

// Auto-reply to a new lead, sent from hello@produceevent.ru (Timeweb mail).
// Requires SMTP_USER / SMTP_PASS in env; host and port have Timeweb defaults.

export async function sendLeadAutoReply(to: string, name: string) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP not configured");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.timeweb.ru",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_PORT || "465") === "465",
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  });

  const firstName = name.trim().split(/\s+/)[0];

  const html = `
  <div style="background:#0a0a0b;padding:40px 24px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="color:#c6a15b;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Produce Event</p>
      <h1 style="color:#ece7df;font-size:28px;font-weight:normal;margin:16px 0;">Спасибо, ${firstName}!</h1>
      <p style="color:#b9b3a8;font-size:16px;line-height:1.6;font-family:Arial,sans-serif;">
        Мы получили ваш бриф и уже думаем над идеями. Вернёмся к вам
        <strong style="color:#ece7df;">в течение одного рабочего дня</strong> —
        с концепцией под вашу задачу, бюджет и аудиторию, а не с шаблонным предложением.
      </p>
      <p style="color:#b9b3a8;font-size:16px;line-height:1.6;font-family:Arial,sans-serif;">
        А пока — прикрепили презентацию с проектами, которыми мы гордимся:
        от городского праздника на 18 000 гостей до приватных событий, о которых мы не рассказываем публично.
      </p>
      <p style="margin:32px 0;">
        <a href="https://produceevent.ru" style="background:#c6a15b;color:#0a0a0b;text-decoration:none;padding:14px 28px;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;">produceevent.ru</a>
      </p>
      <p style="color:#8c877e;font-size:13px;font-family:Arial,sans-serif;line-height:1.6;">
        Если событие срочное — звоните: <a href="tel:+79067724272" style="color:#c6a15b;">+7 (906) 772-42-72</a><br/>
        Produce Event — событийное агентство нового поколения
      </p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Produce Event" <${user}>`,
    to,
    subject: "Ваш бриф у нас — вернёмся с идеями в течение дня",
    html,
    attachments: [
      {
        filename: "Produce Event — презентация.pdf",
        path: path.join(process.cwd(), "public", "presentation.pdf"),
        contentType: "application/pdf",
      },
    ],
  });
}
