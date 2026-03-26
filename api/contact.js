const { Resend } = require('resend');

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

module.exports = async function handler(req, res) {
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

  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
    to: [process.env.RECIPIENT_EMAIL],
    replyTo: email,
    subject: `Portfolio Contact: Message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Courier New', monospace; background-color: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 2px solid #333; padding: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { color: #888; font-weight: bold; }
          .value { margin-top: 5px; }
          .message-box { background-color: #111; border: 1px solid #333; padding: 15px; margin-top: 10px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; color: #888; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h2>&gt; New Contact Form Submission</h2></div>
          <div class="field">
            <div class="label">// Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">// Email:</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">// Message:</div>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            <p>Sent from your portfolio at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent: ${new Date().toLocaleString()}`,
  });

  if (error) {
    console.error('Resend error:', JSON.stringify(error));
    return res.status(500).json({ success: false, message: `Failed to send message: ${error.message || error.name || 'Unknown error'}` });
  }

  return res.status(200).json({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' });
};
