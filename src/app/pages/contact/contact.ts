import express, { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer, { Transporter } from 'nodemailer';

/* ---------- config (server-side env only) ---------- */
const cfg = () => ({
  host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
  port: Number(process.env['SMTP_PORT'] || 587),
  user: process.env['SMTP_USER'] || '',
  pass: (process.env['SMTP_APP_PASSWORD'] || '').replace(/\s+/g, ''), // Google shows it with spaces
  to: process.env['CONTACT_EMAIL'] || 'designcane857@gmail.com',
});

let transporter: Transporter | null = null;
function getTransporter(): Transporter | null {
  const c = cfg();
  if (!c.user || !c.pass) return null;
  transporter ??= nodemailer.createTransport({
    host: c.host,
    port: c.port,
    secure: false,      // port 587 = STARTTLS, not implicit TLS
    requireTLS: true,   // refuse to send if STARTTLS can't be negotiated
    auth: { user: c.user, pass: c.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

/** Call once at boot to log whether SMTP login works. */
export async function verifySmtp(): Promise<boolean> {
  const t = getTransporter();
  if (!t) { console.warn('[contact] SMTP_USER / SMTP_APP_PASSWORD not set; contact form disabled.'); return false; }
  try { await t.verify(); console.log('[contact] SMTP connection verified.'); return true; }
  catch (e) { console.error('[contact] SMTP verify failed:', (e as Error).message); return false; }
}

/* ---------- validation / sanitising ---------- */
const KINDS_MAX = 60;
const oneLine = (s: unknown, max: number) =>
  String(s ?? '').replace(/[\r\n\u2028\u2029]+/g, ' ').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
const multiLine = (s: unknown, max: number) =>
  String(s ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[+\d\s().-]{7,20}$/;

interface Clean { kind: string; name: string; phone: string; email: string; subject: string; message: string }

function validate(body: any): { ok: true; data: Clean } | { ok: false; message: string } {
  const data: Clean = {
    kind: oneLine(body?.kind, KINDS_MAX) || 'General question',
    name: oneLine(body?.name, 100),
    phone: oneLine(body?.phone, 20),
    email: oneLine(body?.email, 254).toLowerCase(),
    subject: oneLine(body?.subject, 150),
    message: multiLine(body?.message, 5000),
  };
  if (!data.name) return { ok: false, message: 'Please enter your name.' };
  if (!EMAIL_RE.test(data.email)) return { ok: false, message: 'Please enter a valid email address.' };
  if (data.phone && !PHONE_RE.test(data.phone)) return { ok: false, message: 'Please enter a valid phone number.' };
  if (data.subject.length < 3) return { ok: false, message: 'Please enter a subject (at least 3 characters).' };
  if (data.message.length < 8) return { ok: false, message: 'Please write a message (at least 8 characters).' };
  if (body?.consent !== true) return { ok: false, message: 'Please tick the consent box so we can contact you.' };
  if ((data.message.match(/https?:\/\//gi) || []).length > 3) return { ok: false, message: 'Your message contains too many links.' };
  return { ok: true, data };
}

/* ---------- email template ---------- */
function renderHtml(d: Clean, meta: { ip: string; when: string }): string {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;width:120px;vertical-align:top;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#7a7568">${k}</td><td style="padding:10px 0;font:15px/1.5 Arial,sans-serif;color:#292823">${v}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f3ede2">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fffdf8;border:1px solid #e4dccb;border-radius:4px">
<tr><td style="background:#2f4a3a;padding:24px 32px;border-radius:4px 4px 0 0">
  <div style="font:600 11px Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#d9c9a8">Crafted By Cane</div>
  <div style="font:600 24px Georgia,serif;color:#fffdf8;margin-top:6px">New website inquiry</div>
</td></tr>
<tr><td style="padding:24px 32px 8px">
  <div style="display:inline-block;padding:4px 12px;background:#f3e3da;color:#8a4a30;border-radius:999px;font:600 12px Arial,sans-serif">${esc(d.kind)}</div>
  <h2 style="margin:14px 0 6px;font:600 20px Georgia,serif;color:#292823">${esc(d.subject)}</h2>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e4dccb;margin-top:12px">
    ${row('Name', esc(d.name))}
    ${row('Email', `<a href="mailto:${esc(d.email)}" style="color:#b96f50">${esc(d.email)}</a>`)}
    ${d.phone ? row('Phone', `<a href="tel:${esc(d.phone.replace(/[^+\d]/g, ''))}" style="color:#b96f50">${esc(d.phone)}</a>`) : ''}
  </table>
</td></tr>
<tr><td style="padding:8px 32px 24px">
  <div style="font:600 11px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#7a7568;margin-bottom:8px">Message</div>
  <div style="padding:16px 18px;background:#f8f3e9;border-left:3px solid #b96f50;font:15px/1.65 Arial,sans-serif;color:#292823;white-space:pre-wrap">${esc(d.message)}</div>
  <p style="margin:20px 0 0;font:13px Arial,sans-serif;color:#7a7568">Just hit <strong>Reply</strong> to answer ${esc(d.name)} directly.</p>
</td></tr>
<tr><td style="padding:14px 32px;border-top:1px solid #e4dccb;font:12px Arial,sans-serif;color:#9a9486">Received ${esc(meta.when)} · IP ${esc(meta.ip)}</td></tr>
</table></td></tr></table></body></html>`;
}

function renderText(d: Clean): string {
  return [`New website inquiry - ${d.kind}`, '', `Name: ${d.name}`, `Email: ${d.email}`, d.phone && `Phone: ${d.phone}`, `Subject: ${d.subject}`, '', d.message]
    .filter((l) => l !== '' ? Boolean(l) : true).join('\n');
}

/* ---------- router ---------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ ok: false, message: 'Too many messages from your connection. Please wait a few minutes and try again.' });
  },
});

export const contactRouter = Router();

contactRouter.post('/', limiter, express.json({ limit: '20kb' }), async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Spam checks. Pretend success so bots learn nothing.
    const tooFast = typeof body?.elapsedMs === 'number' && body.elapsedMs < 3000;
    if (body?.company || tooFast) {
      console.warn('[contact] spam blocked', { honeypot: !!body?.company, tooFast });
      return res.status(200).json({ ok: true });
    }

    const v = validate(body);
    if (!v.ok) return res.status(422).json({ ok: false, message: v.message });
    const d = v.data;

    const t = getTransporter();
    if (!t) {
      console.error('[contact] SMTP credentials missing');
      return res.status(503).json({ ok: false, message: 'Our contact form is temporarily unavailable. Please message us on WhatsApp.' });
    }

    const c = cfg();
    const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';

    const info = await t.sendMail({
      from: { name: 'Crafted By Cane Website', address: c.user }, // must be our own Gmail account
      to: c.to,
      replyTo: { name: d.name, address: d.email },                // visitor goes here, never in "from"
      subject: `[${d.kind}] ${d.subject}`.slice(0, 200),
      text: renderText(d),
      html: renderHtml(d, { ip: req.ip || 'unknown', when }),
    });

    const accepted = (info.accepted || []).map((a: any) => String(typeof a === 'string' ? a : a.address).toLowerCase());
    if (!accepted.includes(c.to.toLowerCase())) {
      console.error('[contact] SMTP did not accept recipient', { accepted: info.accepted, rejected: info.rejected, response: info.response });
      return res.status(502).json({ ok: false, message: 'We could not deliver your message. Please try again or message us on WhatsApp.' });
    }

    console.log('[contact] sent', info.messageId);
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    // Detailed reason goes to server logs only
    if (err?.code === 'EAUTH') console.error('[contact] SMTP auth failed. Check SMTP_USER and SMTP_APP_PASSWORD (App Password, 2-Step Verification on).');
    else console.error('[contact] send failed:', err?.code, err?.message);
    if (err?.type === 'entity.too.large') return res.status(413).json({ ok: false, message: 'Your message is too long.' });
    if (err instanceof SyntaxError) return res.status(400).json({ ok: false, message: 'Invalid request.' });
    return res.status(502).json({ ok: false, message: 'We could not send your message right now. Please try again shortly or message us on WhatsApp.' });
  }
});