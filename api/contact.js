import { Resend } from 'resend';
import { buildEmailHtml } from './_emailTemplate.js';

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY environment variable is not set');
}
if (!process.env.RECIPIENT_EMAIL) {
  console.error('RECIPIENT_EMAIL environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple validation
function validate(name, email, message) {
  if (!name || name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please provide a valid email address.';
  if (!message || message.trim().length < 10) return 'Message must be at least 10 characters.';
  if (message.trim().length > 1000) return 'Message must be under 1000 characters.';
  return null;
}

// In-memory rate limit (per serverless instance — good enough for a portfolio)
const requests = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 5;
  const entry = requests.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    requests.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= max) return true;
  entry.count++;
  requests.set(ip, entry);
  return false;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
  }

  const { name, email, message } = req.body || {};
  const validationError = validate(name, email, message);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
    to: [process.env.RECIPIENT_EMAIL],
    replyTo: email,
    subject: `Portfolio Contact: Message from ${name}`,
    html: buildEmailHtml({ name, email, message }),
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent: ${new Date().toLocaleString()}`,
  });

  if (error) {
    console.error('Resend error:', JSON.stringify(error));
    return res.status(500).json({ success: false, message: `Failed to send message: ${error.message || error.name || 'Unknown error'}` });
  }

  return res.status(200).json({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' });
};
